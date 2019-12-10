const knex = require('../connection');

async function getOneRoom(id) {
    console.log(id);
    return knex('rooms')
        .where('id', id)
        .select('address', 'area', 'description',
                'floor', 'floors', 'photos', 'price',
                'type', 'coord_map_x', 'coord_map_y',
                'name', 'phone_number')
        .then(res => res[0]);
}

module.exports = {
    getOneRoom
}