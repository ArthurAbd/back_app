const express = require('express');
const router = express.Router();
const passport = require('passport');
const dbAd = require('../db/ad');
const v = require('../helpers/validator');

router.post('/newAd', v.validate(v.ADD_AD_SCHEMA),
    passport.authenticate('bearer', { session: false }), 
        async (req, res) => {
            try {
                const {
                    city, type, price, area,
                    floor, floors, address, coordX, coordY,
                    text, photos, photosSmall
                } = req.body
                const idCity = await dbAd.getIdCity(city)
                const idType = await dbAd.getIdType(type)
                const idPhoneNumber = req.user.idPhoneNumber
                const idRoomDescription = await dbAd.addRoomDescription({
                    price, area, floor, floors, address, coordX,
                    coordY, text, photos, photosSmall})
                const idAd = await dbAd.addAd({
                    idCity, idType, idPhoneNumber, idRoomDescription,
                    created: Date.now()
                })

                if (idAd[0]) {
                    return res.status(200).json('Объявление добавлено')
                }
                
                return res.status(500).json('Ошибка на сервере')
            } catch (error) {
                res.status(500).json('Ошибка на сервере')
            }
});

router.post('/editAd', v.validate(v.EDIT_AD_SCHEMA),
    passport.authenticate('bearer', { session: false }), 
        async (req, res) => {
            try {
                const {idAd, price, area, floor, floors, text, photos} = req.body

                const idRoomDescription = await dbAd.getIdRoomDescription(idAd, req.user.idPhoneNumber)
                console.log(idRoomDescription)
                if (await dbAd.editRoomDescription(idRoomDescription,
                    {price, area, floor, floors, text, photos})
                    ) {
                    return res.status(200).json('Объявление обновлено')
                }

                return res.status(500).json('Ошибка на сервере')
            } catch (error) {
                res.status(500).json('Ошибка на сервере')
            }
});

router.post('/removeAd', v.validate(v.REMOVE_AD_SCHEMA),
    passport.authenticate('bearer', { session: false }), 
        async (req, res) => {
            try {
                const {idAd} = req.body

                if (await dbAd.removeAd(idAd, req.user.idPhoneNumber)) {
                    return res.status(200).json('Объявление перемещено в архив')
                }

                return res.status(500).json('Ошибка на сервере')
            } catch (error) {
                res.status(500).json('Ошибка на сервере')
            }
});

router.post('/getMyAds', passport.authenticate('bearer', { session: false }), 
    async (req, res) => {
        try {
            const data = await dbAd.getMyAds(req.user.idPhoneNumber)

            res.status(200).json(data)
        } catch (error) {
            res.status(500).json('Ошибка на сервере')
        }
});

module.exports = router;