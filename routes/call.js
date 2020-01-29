const express = require('express');
const router = express.Router();
const passport = require('passport');
const dbCall = require('../db/call');

router.post('/getInCalls', passport.authenticate('bearer', { session: false }), 
    async (req, res) => {
        try {
            const data = await dbCall.getInCalls(req.user.idPhoneNumber)
            return res.status(200).json(data)
        } catch (error) {
            res.status(500).json('Ошибка на сервере')
        }
});

router.post('/getPhoneNumber', passport.authenticate('bearer', { session: false }), 
    async (req, res) => {
        try {
            const {idAd} = req.body
            if (!await dbCall.getIdInCall(idAd, req.user.idPhoneNumber)) {
                await dbCall.addIdInCall(idAd, req.user.idPhoneNumber)
            }
            
            const outCall = await dbCall.getIdOutCall(idAd, req.user.userId)
            if (!outCall) {
                outCall = await dbCall.addIdOutCall(idAd, req.user.userId) 
            }

            const phoneNumber = await dbCall.getPhoneNumberByAd(idAd)
            const data = {phoneNumber, ...outCall}
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json('Ошибка на сервере')
        }
});

router.post('/updateInCallRating', passport.authenticate('bearer', { session: false }), 
    async (req, res) => {
        try {
            const {idInCall, rating} = req.body
            const userPhoneByInCall = await dbCall.getUserPhoneByInCall(idInCall)
            if (req.user.idPhoneNumber !== userPhoneByInCall) {
                return res.status(403).json('Ошибка доступа')
            }

            if (await dbCall.updateInCallRating(idInCall, rating)) {
                return res.status(200).json('Отправлено')
            }
            res.status(500).json('Ошибка на сервере')
        } catch (error) {
            res.status(500).json('Ошибка на сервере')
        }
});

router.post('/updateOutCallRating', passport.authenticate('bearer', { session: false }), 
    async (req, res) => {
        try {
            const {idOutCall, rating} = req.body
            const userByOutCall = await dbCall.getUserByOutCall(idOutCall)
            if (req.user.userId !== userByOutCall) {
                return res.status(403).json('Ошибка доступа')
            }

            if (await dbCall.updateOutCallRating(idOutCall, rating)) {
                return res.status(200).json('Отправлено')
            }
            res.status(500).json('Ошибка на сервере')
        } catch (error) {
            res.status(500).json('Ошибка на сервере')
        }
});

module.exports = router;