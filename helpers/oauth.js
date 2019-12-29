const passport                = require('passport')
const BasicStrategy           = require('passport-http').BasicStrategy
const ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy
const BearerStrategy          = require('passport-http-bearer').Strategy
const dbOauth                 = require('../db/oauth');


passport.use(new BasicStrategy(
    async function(username, password, done) {
        try {
            const client = await dbOauth.findClient(username)
            if (!client) done(null, false)
            if (client.secret != password) done(null, false)
            return done(null, client);
        } catch (error) {
            return done(error)
        }
    }
))

passport.use(new ClientPasswordStrategy(
    async function(clientId, clientSecret, done) {
        try {
            const client = await dbOauth.findClient(clientId)
            if (!client) done(null, false)
            if (client.secret != clientSecret) done(null, false)
            return done(null, client);
        } catch (error) {
            return done(error)
        }
    }
));

passport.use(new BearerStrategy(
    async function(accessToken, done) {
        try {
            const dbAccessToken = await dbOauth.findAccessToken(accessToken)
            if (!dbAccessToken) done(null, false)

            if (dbAccessToken.created + 3600 < Date.now()) {
                dbOauth.delAccessTokenByToken(accessToken)
                return done(null, false, { message: 'Token expired' }) 
            }

            const user = await dbOauth.findUserById(dbAccessToken.user_id)
            if (!user) done(null, false, { message: 'Unknown user' })

            const info = { scope: '*' }
            done(null, user, info);

        } catch (error) {
            return done(error)
        }
    }
));