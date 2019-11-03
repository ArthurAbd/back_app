var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
    console.log(req.params);
    res.send('room');
});

module.exports = router;
