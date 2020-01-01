const crypto = require('crypto')


const encryptPassword = (password, salt) => {
    return crypto.createHmac("sha1", salt).update(password).digest('hex');
}

const checkPassword = (plainPassword, passwordHash, salt) => {
    return encryptPassword(plainPassword, salt) === passwordHash;
}

module.exports = {
    encryptPassword,
    checkPassword,
}