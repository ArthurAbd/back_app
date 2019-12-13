const knex = require('../connection');


async function getListRooms(dataQuery) {
    console.log('sss', dataQuery.city)
    const result =  await knex('rooms')
        .where('city', dataQuery.city)
        .whereIn('type', dataQuery.type)
        .orderBy(dataQuery.orderBy, dataQuery.order)
        .whereBetween('price', [dataQuery.min, dataQuery.max])
        .whereBetween('coord_map_x', dataQuery.coordX)
        .whereBetween('coord_map_y', dataQuery.coordY)
        .offset(dataQuery.offset)
        .limit(dataQuery.limit)
        .select('id', 'price', 'address', 'photos', 'coord_map_x', 'coord_map_y');

    const coords =  await knex('rooms')
        .where('city', dataQuery.city)
        .whereIn('type', dataQuery.type)
        .orderBy(dataQuery.orderBy, dataQuery.order)
        .whereBetween('price', [dataQuery.min, dataQuery.max])
        .whereBetween('coord_map_x', dataQuery.coordX)
        .whereBetween('coord_map_y', dataQuery.coordY)
        .select('id', 'coord_map_x', 'coord_map_y');

    return {result, coords}
}


module.exports = {
    getListRooms
}