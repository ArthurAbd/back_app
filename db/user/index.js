const knex = require('../connection');

async function addUser(data) {
    return knex('user')
        .insert(data);
}

async function findUserById(id) {
    return knex('user')
        .where('userId', id)
        .then(res => {
            if (!res) undefined
            return res[0]
        });
}

async function findUserByidPhoneNumber(id) {
    return knex('user')
        .where('idPhoneNumber', id)
        .select('userId')
        .then(res => {
            if (!res[0]) {return undefined}
            return res[0]
        })
}

async function findNumberOrCreate(number) {
    return knex('phone_number')
        .where('number', number)
        .select('idPhoneNumber')
        .then(res => {
            if (res[0]) {return res[0].idPhoneNumber}
            return knex('phone_number')
                .insert({number})
                .then(res => res[0])
        })
}


// findUserByidPhoneNumber(2).then((res) => console.log(!!res))

async function editUser(data, id) {
    return knex('user')
        .where('userId', id)
        .update(data)
}


module.exports = {
    editUser,
    addUser,
    findUserById,
    findUserByidPhoneNumber,
    findNumberOrCreate
}