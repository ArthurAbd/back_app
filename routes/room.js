const express = require('express');
const router = express.Router();
const dbRoom = require('../db/room');

router.post('/getOneRoom', async (req, res) => {
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

router.post('/getListRooms', async (req, res) => {
    try {
        let dataQuery = {
            orderBy: 'created',
            order: 'asc',
            offset: 0,
            limit: 10,
            min: 0,
            max: 9999999,
            type: ['r', 'st', '1k', '2k', '3k', '4k+'],
            coordX: [-90, 90],
            coordY: [-180, 180],
        };

        dataQuery = {...dataQuery, ...req.body}
        if (req.body && req.body.type) {
            dataQuery.type = req.body.type.split(',')
        }
        if (req.body && req.body.coordX && req.body.coordY) {
            dataQuery.coordX = req.body.coordX.split(',')
            dataQuery.coordY = req.body.coordY.split(',')
        }

        const data = await dbRoom.getListRooms(dataQuery);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json('Ошибка на сервере');
    }
});

router.post('/getMapItem', async (req, res) => {
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
