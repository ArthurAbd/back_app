const express = require('express');
const router = express.Router();
const dbRoom = require('../db/room');

router.get('/', async (req, res) => {
    try {
        const id = req.query.id;
        const data = await dbRoom.getOneRoom(id);
        res.status(200)
        .json(data);
    } catch (error) {
        res.status(500)
        .json('Error');
    }
});


module.exports = router;
