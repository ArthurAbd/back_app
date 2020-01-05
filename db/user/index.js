const knex = require('../connection');

async function addUser(data) {
    return knex('user')
        .insert(data);
}

async function findUser(email) {
    return knex('user')
        .where('email', email)
        .then(res => {
            if (!res) undefined
            return res[0]
        });
}

async function findUserById(id) {
    return knex('user')
        .where('userId', id)
        .then(res => {
            if (!res) undefined
            return res[0]
        });
}

async function findUserByEmail(email) {
    return knex('user')
        .where('email', email)
        .then(res => {
            if (!res) undefined
            return res[0]
        });
}

async function editUser(data, id) {
    return knex('user')
        .where('userId', id)
        .update(data)
}


module.exports = {
    editUser,
    addUser,
    findUser,
    findUserById,
    findUserByEmail
}