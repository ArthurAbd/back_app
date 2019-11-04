const knex = require('../connection');


async function getListRoom(dataQuery) {
    return knex('rooms')
        .whereIn('type', dataQuery.type)
        .whereBetween('price', [dataQuery.min, dataQuery.max])
        .whereBetween('coord_map_x', dataQuery.coordX)
        .whereBetween('coord_map_y', dataQuery.coordY)
        .orderBy(dataQuery.orderBy, dataQuery.order)
        .offset(dataQuery.offset)
        .limit(dataQuery.limit);
        // .select('id', 'title', 'description', 'main_image', 'repost', 'created_at', 'updated_at');
}

module.exports = {
    getListRoom
}