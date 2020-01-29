const knex = require('../connection');

async function getIdCity(tag) {
    return knex('city')
        .where('tag', tag)
        .select('idCity')
        .first()
        .then(res => res.idCity);
}

async function getIdType(tag) {
    return knex('type')
        .where('tag', tag)
        .select('idType')
        .first()
        .then(res => res.idType);
}

async function getIdRoomDescription(id, idPhoneNumber) {
    return knex('ad')
        .where({
            'idAd': id,
            'idPhoneNumber': idPhoneNumber
        })
        .select('idRoomDescription')
        .first()
        .then(res => res.idRoomDescription);
}

async function removeAd(id, idPhoneNumber) {
    return knex('ad')
        .where({
            'idAd': id,
            'idPhoneNumber': idPhoneNumber
        })
        .update({
            'isActive': 0
        });
}

async function addRoomDescription(data) {
    return knex('room_description')
        .insert(data)
}

async function editRoomDescription(id, data) {
    return knex('room_description')
        .where('idRoom', id)
        .update(data)
}

async function addAd(data) {
    return knex('ad')
        .insert(data)
}

async function getMyAds(id) {
    return knex('ad')
        .where({'idPhoneNumber': id, 'isActive': 1})
        .innerJoin('room_description', 'ad.idRoomDescription', '=', 'room_description.idRoom')
        .limit(10)
        .select('idAd', 'idType', 'price', 'area', 'address', 'photos')
}

module.exports = {
    getIdCity,
    getIdType,
    addRoomDescription,
    addAd,
    getIdRoomDescription,
    editRoomDescription,
    removeAd,
    getMyAds
}