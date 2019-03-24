'use strict';

const loaderFactory = require('./loader');

const getUsers = function (idsArr) {
    console.log(`Actual queried ids ${idsArr}`);

    return new Promise(function (resolve) {
        function fetchUsersMockup () {
            const users = [];

            // idsArr.forEach((id) => users.push({userId: id}));
            idsArr.forEach((id) => users.push(id == 3 ? null : {userId: id}));

            resolve(users);
        }

        setTimeout(fetchUsersMockup, 100);
    });
};

const getUser = loaderFactory(getUsers);

Promise.all([
    getUser(1),
    getUser(2),
    getUser(3),
    getUser(4)
]).then((values) => console.log(`received users ${JSON.stringify(values)}`)).catch((err) => console.error(err));

Promise.all([
    getUser(1),
    getUser(3),
    getUser(3),
    getUser(4)
]).then((values) => console.log(`received users ${JSON.stringify(values)}`)).catch((err) => console.error(err));

Promise.all([
    getUser(1),
    getUser(5)
]).then((values) => console.log(`received users ${JSON.stringify(values)}`)).catch((err) => console.error(err));

function otherAsyncReq () {
    Promise.all([
        getUser(1),
        getUser(3),
        getUser(6),
        getUser(4)
    ]).then((values) => console.log(`received users ${JSON.stringify(values)}`)).catch((err) => console.error(err));
}

setTimeout(otherAsyncReq, 4000);