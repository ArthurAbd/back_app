const express = require('express');
const router = express.Router();
const passport = require('passport');
const dbOauth = require('../db/oauth');


router.post('/',
  passport.authenticate('bearer', { session: false }), async (req, res) => {
    await dbOauth.delRefreshToken(req.user.userId, req.body.client_id)
    await dbOauth.delAccessToken(req.user.userId, req.body.client_id)
    req.logOut();
    console.log(req.user);
    res.redirect("/");
  });


module.exports = router;
