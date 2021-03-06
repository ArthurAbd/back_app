const passport                = require('passport')
const BasicStrategy           = require('passport-http').BasicStrategy
const ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy
const BearerStrategy          = require('passport-http-bearer').Strategy
const dbOauth                 = require('../db/oauth');
const dbUser                  = require('../db/user');
const authHelper              = require('./auth')


passport.use(new BasicStrategy(
    async function(username, password, done) {
        try {
            const idPhoneNumber = await dbUser.getIdNumber(username);
            const user = idPhoneNumber ?
                await dbUser.findUserByidPhoneNumber(idPhoneNumber) : undefined

            if (!user) return done(null, false)
            if (!authHelper.checkPassword(password, user.password, user.idPhoneNumber)) return done(null, false)

            return done(null, user);
        } catch (error) {
            return done(error)
        }
    }
))

passport.use(new ClientPasswordStrategy(
    async function(clientId, clientSecret, done) {
        try {
            const client = await dbOauth.findClient(clientId)
            if (!client) return done(null, false)
            if (client.secret != clientSecret) return done(null, false)
            return done(null, client);
        } catch (error) {
            return done(error)
        }
    }
));

passport.use(new BearerStrategy(
    async function(token, done) {
        try {
            const dbAccessToken = await dbOauth.findAccessToken(token)
            if (!dbAccessToken) return done(null, false, { message: 'Token not found' })
            if (+dbAccessToken.created + 60 * 60 * 1000 < Date.now()) {
                dbOauth.delAccessTokenByToken(token)
                return done(null, false, { message: 'Token expired' }) 
            }

            const user = await dbUser.findUserById(dbAccessToken.userId)
            if (!user) return done(null, false, { message: 'Unknown user' })

            return done(null, user, { scope: '*' });

        } catch (error) {
            return done(error)
        }
    }
));



