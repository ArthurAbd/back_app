const knex = require('../connection');


async function getListRoom(dataQuery) {
    const total = await knex('rooms')
        .count()
        .whereIn('type', dataQuery.type)
        .orderBy(dataQuery.orderBy, dataQuery.order)
        .whereBetween('price', [dataQuery.min, dataQuery.max])
        .whereBetween('coord_map_x', dataQuery.coordX)
        .whereBetween('coord_map_y', dataQuery.coordY)

    const result =  await knex('rooms')
        .whereIn('type', dataQuery.type)
        .orderBy(dataQuery.orderBy, dataQuery.order)
        .whereBetween('price', [dataQuery.min, dataQuery.max])
        .whereBetween('coord_map_x', dataQuery.coordX)
        .whereBetween('coord_map_y', dataQuery.coordY)
        .offset(dataQuery.offset)
        .limit(dataQuery.limit)
        .select('id', 'price', 'address', 'photos', 'coord_map_x', 'coord_map_y');

    return {total, result}
}


module.exports = {
    getListRoom
}