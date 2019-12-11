const express = require('express');
const router = express.Router();
const dbMap = require('../db/map');

router.get('/', async (req, res) => {
    try {
        const id = req.query.id;
        const data = await dbMap.getMapItem(id);
        res.status(200)
        .json(data);
    } catch (error) {
        res.status(500)
        .json('Error');
    }
});


module.exports = router;
