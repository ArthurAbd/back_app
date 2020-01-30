const express = require('express');
const router = express.Router();
const dbRoom = require('../db/room');
const v = require('../helpers/validator');

router.post('/getOneRoom', v.validate(v.GET_ONE_ROOM_SCHEMA), 
    async (req, res) => {
        try {
            const {id} = req.body;
            const data = await dbRoom.getOneRoom(id);
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
        try {
            if (req.body.type === 'string') {
                dataQuery.type = req.body.type.split(',')
            }
            if (req.body.coordX === 'string' && req.body.coordY === 'string') {
                dataQuery.coordX = req.body.coordX.split(',')
                dataQuery.coordY = req.body.coordY.split(',')
            }

            const data = await dbRoom.getListRooms(req.body);
            res.status(200).json(data);
        } catch (error) {
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
