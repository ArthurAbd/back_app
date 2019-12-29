const oauth2orize         = require('oauth2orize');
const passport            = require('passport');
const crypto              = require('crypto');
const dbOauth             = require('../db/oauth');
const authHelper          = require('./auth')

const server = oauth2orize.createServer();

server.exchange(oauth2orize.exchange.password(async function(client, email, password, scope, done) {
    try {
        const user = await dbOauth.findUserByEmail(email)
        if (!user) done(null, false)
        if (!authHelper.checkPassword(password, user.password, user.id)) done(null, false)
        
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
        
        done(null, tokenValue, refreshTokenValue, { 'expires_in': 3600 })
    } catch (error) {
        return done(error)
    }
}))

server.exchange(oauth2orize.exchange.refreshToken(async function(client, refreshToken, scope, done) {
    try {
        const dbRefreshToken = await dbOauth.findRefreshToken(refreshToken)
        if (!dbRefreshToken) done(null, false)

        const user = await dbOauth.findUserById(dbRefreshToken.userId)
        if (!user) done(null, false)

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
        
        done(null, tokenValue, refreshTokenValue, { 'expires_in': 3600 })
    } catch (error) {
        return done(err)
    }
}))


exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
]