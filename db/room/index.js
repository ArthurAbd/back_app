const knex = require('../connection');

async function getOneRoom(id) {
    return knex('ad')
        .where('idAd', id)
        .innerJoin('city', 'city.idCity', '=', 'ad.idCity')
        .innerJoin('type', 'type.idType', '=', 'ad.idType')
        .innerJoin('room_description', 'room_description.idRoom', '=', 'ad.idRoomDescription')
        .select('ad.idAd', 'room_description.address', 'room_description.area',
                'room_description.floor', 'room_description.floors',
                'room_description.photos', 'room_description.price',
                'room_description.coordX', 'room_description.coordY',
                'room_description.text', 'room_description.origin', 
                'city.name', 'type.name', 'type.shortName','ad.created', 'origin')
        .then(res => res[0]);
}

async function getListRooms(dataQuery) {
    const result = await knex('ad')
        .innerJoin('city', 'city.idCity', '=', 'ad.idCity')
        .innerJoin('type', 'type.idType', '=', 'ad.idType')
        .innerJoin('room_description', 'room_description.idRoom', '=', 'ad.idRoomDescription')
        .where('city.tag', dataQuery.city)
        .whereIn('type.tag', dataQuery.type)
        .orderBy(dataQuery.orderBy, dataQuery.order)
        .whereBetween('room_description.price', [dataQuery.min, dataQuery.max])
        .whereBetween('room_description.coordX', dataQuery.coordX)
        .whereBetween('room_description.coordY', dataQuery.coordY)
        .offset(dataQuery.offset)
        .limit(dataQuery.limit)
        .select('ad.idAd', 'room_description.price', 'type.name',
            'room_description.address', 'room_description.area',
            'room_description.photos', 'room_description.origin')

    const coords = await knex('ad')
        .innerJoin('city', 'city.idCity', '=', 'ad.idCity')
        .innerJoin('type', 'type.idType', '=', 'ad.idType')
        .innerJoin('room_description', 'room_description.idRoom', '=', 'ad.idRoomDescription')
        .where('city.tag', dataQuery.city)
        .whereIn('type.tag', dataQuery.type)
        .orderBy(dataQuery.orderBy, dataQuery.order)
        .whereBetween('room_description.price', [dataQuery.min, dataQuery.max])
        .whereBetween('room_description.coordX', dataQuery.coordX)
        .whereBetween('room_description.coordY', dataQuery.coordY)
        .select('ad.idAd', 'room_description.coordX', 'room_description.coordY')

    return {result, coords}
}

async function getMapItem(id) {
    return knex('ad')
        .where('idAd', id)
        .innerJoin('city', 'city.idCity', '=', 'ad.idCity')
        .innerJoin('type', 'type.idType', '=', 'ad.idType')
        .innerJoin('room_description', 'room_description.idRoom', '=', 'ad.idRoomDescription')
        .select('ad.idAd', 'room_description.price', 'type.name', 'room_description.area',
            'room_description.coordX', 'room_description.coordY', 'room_description.origin')
        .first()
}

module.exports = {
    getOneRoom,
    getListRooms,
    getMapItem
}