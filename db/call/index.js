const knex = require('../connection');

async function getInCalls(id) {
    return knex('ad')
        .where({'ad.idPhoneNumber': id})
        .innerJoin('incoming_call', 'incoming_call.idAd', '=', 'ad.idAd')
        .innerJoin('room_description', 'room_description.idRoom', '=', 'ad.idRoomDescription')
        .innerJoin('type', 'type.idType', '=', 'ad.idType')
        .innerJoin('phone_number', 'phone_number.idPhoneNumber', '=', 'incoming_call.idPhoneNumber')
        .select('incoming_call.idInCall', 'incoming_call.rating',
                'phone_number.number', 'room_description.area', 
                'room_description.photosSmall', 'type.name',
                'incoming_call.created', 'ad.idAd')
}

async function getPhoneNumberByAd(idAd) {
    return knex('ad')
        .where({'idAd': idAd})
        .innerJoin('phone_number', 'phone_number.idPhoneNumber', '=', 'ad.idPhoneNumber')
        .select('phone_number.number')
        .then(([{number}]) => number)
}

async function getIdInCall(idAd, idPhoneNumber) {
    return knex('incoming_call')
        .where({'idAd': idAd, 'idPhoneNumber': idPhoneNumber})
        .then((res) => {
            if (res[0]) {return res[0]}
            return undefined
        })
}

async function addIdInCall(idAd, idPhoneNumber) {
    return knex('incoming_call')
        .insert({
            idPhoneNumber, idAd,
            rating: 0,
            created: Date.now()
        })
        .then(res => {
            return knex('incoming_call')
                .where({'idInCall': res[0]})
                .then((res) => {
                    if (res[0]) {return res[0]}
                })
        })
}

async function getIdOutCall(idAd, idUser) {
    return knex('outgoing_call')
        .where({'idAd': idAd, 'idUser': idUser})
        .select('idOutCall', 'rating')
        .then((res) => {
            if (res[0]) {return res[0]}
            return undefined
        })
}

async function addIdOutCall(idAd, idUser) {
    return knex('outgoing_call')
        .insert({
            idUser, idAd,
            rating: 0,
            created: Date.now()
        })
        .then(res => {
            return knex('outgoing_call')
                .where({'idOutCall': res[0]})
                .select('idOutCall', 'rating')
                .then((res) => {
                    if (res[0]) {return res[0]}
                })
        })
}

async function getUserPhoneByInCall(idInCall) {
    return knex('incoming_call')
        .where({'idInCall': idInCall})
        .innerJoin('ad', 'ad.idAd', '=', 'incoming_call.idAd')
        .select('ad.idPhoneNumber')
        .then(([{idPhoneNumber}]) => idPhoneNumber)
}

async function updateInCallRating(idInCall, rating) {
    return knex('incoming_call')
        .where({'idInCall': idInCall})
        .update('rating', rating)
}

async function getUserByOutCall(idOutCall) {
    return knex('outgoing_call')
        .where({'idOutCall': idOutCall})
        .select('idUser')
        .then(([{idUser}]) => idUser)
}

async function updateOutCallRating(idOutCall, rating) {
    return knex('outgoing_call')
        .where({'idOutCall': idOutCall})
        .update('rating', rating)
}

module.exports = {
    getInCalls,
    getIdInCall,
    addIdInCall,
    getIdOutCall,
    addIdOutCall,
    getPhoneNumberByAd,
    updateInCallRating,
    getUserPhoneByInCall,
    updateOutCallRating,
    getUserByOutCall
}