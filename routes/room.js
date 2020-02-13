const express = require('express');
const router = express.Router();
const dbRoom = require('../db/room');
const v = require('../helpers/validator');

router.post('/getOneRoom', v.validate(v.GET_ONE_ROOM_SCHEMA), 
    async (req, res) => {
        try {
            const {idAd} = req.body;
            const data = await dbRoom.getOneRoom(idAd);
            if (!data) {
                return res.status(404).json('Страница не найдена');
            }

            res.status(200).json(data);
        } catch (error) {
            res.status(500).json('Ошибка на сервере');
        }
});

router.post('/getListRooms', v.validate(v.GET_LIST_ROOM_SCHEMA),
    async (req, res) => {
        const dataQuery = {...req.body}
        try {
            if (typeof req.body.type === 'string') {
                dataQuery.type = req.body.type.split(',')
            }
            if (typeof req.body.coordX === 'string' && typeof req.body.coordY === 'string') {
                dataQuery.coordX = req.body.coordX.split(',')
                dataQuery.coordY = req.body.coordY.split(',')
            }
            console.log('dataQuery',dataQuery)
            const data = await dbRoom.getListRooms(dataQuery);
            res.status(200).json(data);
        } catch (err) {
            console.log(err)
            res.status(500).json('Ошибка на сервере');
        }
});

router.post('/getMapItem', v.validate(v.GET_MAP_ITEM_SCHEMA),
    async (req, res) => {
        try {
            const {idAd} = req.body;
            const data = await dbRoom.getMapItem(idAd);

            if (data) {return res.status(200).json(data)}

            res.status(404).json('Не найдено')
        } catch (error) {
            res.status(500).json('Ошибка на сервере');
        }
});


module.exports = router;
