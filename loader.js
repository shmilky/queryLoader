'use strict';

function createLoader(getManyEntities) {
    let cachedEntities = {};

    let waitingGetEntityMethods = {};

    function cacheEntity(entityId, entityData) {
        cachedEntities[entityId] = {data: entityData};
    }

    function getCachedEntityData(entityId) {
        if (cachedEntities[entityId]) {
            return cachedEntities[entityId].data;
        }
        else {
            return false;
        }
    }

    function asyncOneTimeEntitiesFetch () {
        const requestedEntitiesIdsForExec = Object.keys(waitingGetEntityMethods);

        if (requestedEntitiesIdsForExec.length > 0) {
            const methodsToBeExec = waitingGetEntityMethods;
            waitingGetEntityMethods = {};
            const notCachedEntityIds = [];

            requestedEntitiesIdsForExec.forEach(function (itEntityId) {
                if (!getCachedEntityData(itEntityId)) {
                    notCachedEntityIds.push(itEntityId);
                }
            });

            getManyEntities(notCachedEntityIds).then(function(fetchedEntities) {
                let currItEntityId, currResEntityData;

                for (let i=0;i<notCachedEntityIds.length; i++) {
                    currItEntityId = notCachedEntityIds[i];
                    currResEntityData = fetchedEntities[i];

                    cacheEntity(currItEntityId, currResEntityData);
                }

                Object.keys(methodsToBeExec).forEach(function (requestedEntityId) {
                    methodsToBeExec[requestedEntityId].forEach((itResolve) => itResolve(getCachedEntityData(requestedEntityId)));
                });
            });
        }
    }

    const getOneEntity = function (entityId) {
        if (!waitingGetEntityMethods[entityId]) {
            waitingGetEntityMethods[entityId] = []
        }

        return new Promise(function (resolve) {
            waitingGetEntityMethods[entityId].push(resolve);
            setTimeout(asyncOneTimeEntitiesFetch, 0);
        });
    };

    return getOneEntity;
}

module.exports = createLoader;
