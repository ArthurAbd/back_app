const knex = require('../connection');

async function getOneRoom(id) {
    console.log(id);
    return knex('rooms')
        .where('id', id)
        // .select('city');
        .then(res => res[0]);
}

module.exports = {
    getOneRoom
}