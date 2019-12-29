const knex = require('../connection');

async function findClient(id) {
    return knex('client')
        .where('client_id', id)
        .then(res => {
            if (!res) undefined
            return res[0]
        });
}

try {
    findClient('211').then((data) => console.log(data))

} catch (error) {
    console.log('hui')
}