const express = require('express');
const router = express.Router();
const dbUser = require('../db/user');
const passport = require('passport');
const authHelper = require('../helpers/auth');

router.post('/add', async (req, res) => {
    try {
        const data = req.body;
        const info = {
            name: data.name,
            email: data.email,
            password: authHelper.encryptPassword(data.password, data.email),
            created: Date.now()
        }
        const id = await dbUser.saveUser(info);
        console.log(id)
        res.status(200)
        .json('Add user');
    } catch (error) {
        res.status(500)
        .json('Error');
    }
});

router.post('/profile',
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.json(req.user);
  });


module.exports = router;
