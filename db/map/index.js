const knex = require('../connection');

async function getMapItem(id) {
    console.log(id);
    return knex('rooms')
        .where('id', id)
        .select('id', 'photos', 'price',
                'coord_map_x', 'coord_map_y')
        .then(res => res[0]);
}

module.exports = {
    getMapItem
}