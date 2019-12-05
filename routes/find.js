const express = require('express');
const router = express.Router();
const dbFind = require('../db/find');

router.get('/', async (req, res) => {
    try {
        const defaultQuery = {
            orderBy: 'price',
            order: 'ACS',
            offset: 0,
            limit: 10,
            min: 0,
            max: 9999999,
            type: ['r', 'st', '1k', '2k', '3k', '4k+', ],
            coordX: [-90, 90],
            coordY: [-180, 180],
        };
        dataQuery = {...defaultQuery, ...req.query}
        console.log('GET',dataQuery);
        const data = await dbFind.getListRoom(dataQuery);
        console.log(data)
        res.status(200)
        console.log(res)
        res.json(data);
    } catch (error) {
        res.status(500)
        .json('Error');
    }
});

router.post('/', async (req, res) => {
    try {
        dataQuery = req.body.data;
        console.log(dataQuery);
        const data = await dbFind.getListRoom(dataQuery);
        console.log(data);
        res.status(200)
        .json(data);
    } catch (error) {
        res.status(500)
        .json('Error');
    }
});

module.exports = router;
