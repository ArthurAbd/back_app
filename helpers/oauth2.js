const oauth2orize         = require('oauth2orize');
const passport            = require('passport');
const crypto              = require('crypto');
const dbOauth             = require('../db/oauth');
const dbUser              = require('../db/user');
const authHelper          = require('./auth')

const server = oauth2orize.createServer();

server.exchange(oauth2orize.exchange.password(async function(client, username, password, scope, done) {
    try {       
        const idPhoneNumber = await dbUser.getIdNumber(username);
        const user = idPhoneNumber ?
            await dbUser.findUserByidPhoneNumber(idPhoneNumber) : undefined

        if (!user) return done(null, false, { message: 'Пользователь не существует' })
        if (!authHelper.checkPassword(password, user.password, idPhoneNumber)) {
            return done(null, false, { message: 'Не правильный пароль' })
        }

        await dbOauth.delRefreshToken(user.userId, client.clientId)
        await dbOauth.delAccessToken(user.userId, client.clientId)

        const tokenValue = crypto.randomBytes(32).toString('base64');
        const refreshTokenValue = crypto.randomBytes(32).toString('base64');
        await dbOauth.saveAccessToken({
            token: tokenValue,
            clientId: client.clientId,
            userId: user.userId,
            created: Date.now()
        })
        await dbOauth.saveRefreshToken({
            token: refreshTokenValue,
            clientId: client.clientId,
            userId: user.userId,
            created: Date.now()
        })
        
        return done(null, tokenValue, refreshTokenValue, { 'expires_in': 3600 })
    } catch (error) {
        return done(error)
    }
}))

server.exchange(oauth2orize.exchange.refreshToken(async function(client, refreshToken, scope, done) {
    try {
        const dbRefreshToken = await dbOauth.findRefreshToken(refreshToken)
        if (!dbRefreshToken) return done(null, false, { message: 'Incorrect refresh token' })

        const user = await dbUser.findUserById(dbRefreshToken.userId)
        if (!user) return done(null, false, { message: 'Incorrect user' })

        await dbOauth.delRefreshToken(user.userId, client.clientId)
        await dbOauth.delAccessToken(user.userId, client.clientId)
        
        const tokenValue = crypto.randomBytes(32).toString('base64');
        const refreshTokenValue = crypto.randomBytes(32).toString('base64');

        await dbOauth.saveAccessToken({
            token: tokenValue,
            clientId: client.clientId,
            userId: user.userId,
            created: Date.now()
        })
        await dbOauth.saveRefreshToken({
            token: refreshTokenValue,
            clientId: client.clientId,
            userId: user.userId,
            created: Date.now()
        })
        
        return done(null, tokenValue, refreshTokenValue, { 'expires_in': 3600 })
    } catch (error) {
        return done(err)
    }
}))


exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], {failureFlash: true, session: false}),
    server.token(),
    server.errorHandler()
]