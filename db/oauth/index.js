const knex = require('../connection');

async function findClient(id) {
    return knex('client')
        .where('clientId', id)
        .then(res => {
            if (!res) undefined
            return res[0]
        });
}

async function findAccessToken(token) {
    return knex('access_token')
        .where('token', token)
        .then(res => {
            if (!res) undefined
            return res[0]
        });
}

async function findRefreshToken(refreshToken) {
    return knex('refresh_token')
        .where('token', refreshToken)
        .then(res => {
            if (!res) undefined
            return res[0]
        });
}


async function delAccessTokenByToken(token) {
    return knex('access_token')
        .where('token', token)
        .del();
}

async function delAccessToken(userId, clientId) {
    return knex('access_token')
        .where({
            userId: userId,
            clientId: clientId
        })
        .del();
}

async function delRefreshToken(userId, clientId) {
    return knex('refresh_token')
        .where({
            userId: userId,
            clientId: clientId
        })
        .del();
}

async function saveAccessToken(data) {
    return knex('access_token')
        .insert(data);
}

async function saveRefreshToken(data) {
    return knex('refresh_token')
        .insert(data);
}


module.exports = {
    findRefreshToken,
    saveRefreshToken,
    saveAccessToken,
    delAccessToken,
    delRefreshToken,
    delAccessTokenByToken,
    findAccessToken,
    findClient
}