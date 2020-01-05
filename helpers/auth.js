const crypto = require('crypto')


const encryptPassword = (password, salt) => {
    console.log('encryptPassword',salt)
    return crypto.createHmac("sha1", salt).update(password).digest('hex');
}

const checkPassword = (plainPassword, passwordHash, salt) => {
    console.log('checkPassword',salt)
    return encryptPassword(plainPassword, salt) === passwordHash;
}

module.exports = {
    encryptPassword,
    checkPassword,
}