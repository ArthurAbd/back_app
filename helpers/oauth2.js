const oauth2orize         = require('oauth2orize');
const passport            = require('passport');
const crypto              = require('crypto');
const dbOauth             = require('../db/oauth');
const authHelper          = require('./auth')

const server = oauth2orize.createServer();

server.exchange(oauth2orize.exchange.password(async function(client, username, password, scope, done) {
    try {
        console.log('serverPassword', arguments)
        const user = await dbOauth.findUserByEmail(username)
        if (!user) return done(null, false)
        if (!authHelper.checkPassword(password, user.password, user.username)) return done(null, false)

        await dbOauth.delRefreshToken(user.userId, client.clientId)
        await dbOauth.delAccessToken(user.userId, client.clientId)
        console.log(user)
        console.log(typeof(Date.now()))

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
        console.log(error)
        return done(error)
    }
}))

server.exchange(oauth2orize.exchange.refreshToken(async function(client, refreshToken, scope, done) {
    try {
        console.log('serverRefreshToken', arguments)
        const dbRefreshToken = await dbOauth.findRefreshToken(refreshToken)
        if (!dbRefreshToken) return done(null, false)

        const user = await dbOauth.findUserById(dbRefreshToken.userId)
        if (!user) return done(null, false)

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
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
]