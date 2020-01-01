const knex = require('../connection');

async function saveUser(data) {
    return knex('user')
        .insert(data);
}

module.exports = {
    saveUser,
}