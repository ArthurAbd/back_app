const express = require('express');
const router = express.Router();
const dbUser = require('../db/user');
const dbOauth = require('../db/oauth');
const passport = require('passport');
const authHelper = require('../helpers/auth');

router.post('/edit',
  passport.authenticate('bearer', { session: false }),
    async (req, res) => {
      try {
          const data = req.body;
          const info = {
              name: data.name,
              email: data.email,
              password: authHelper.encryptPassword(data.password, data.email)
          }
          dbUser.editUser(info, req.user.userId)
          res.status(200)
          .json('User edit');
      } catch (error) {
          res.status(500)
          .json('Error');
      }
  });

router.post('/add', async (req, res) => {
    try {
        const data = req.body;
        const info = {
            name: data.name,
            email: data.email,
            password: authHelper.encryptPassword(data.password, data.email),
            created: Date.now()
        }
        const isUser = await dbUser.findUser(data.email);
        if (isUser) {return res.status(200).json('Пользователь уже существует')}
        
        const id = await dbUser.addUser(info);
        if (id) {return res.status(200).json('Пользователь добавлен')}

        res.status(200)
        .json('Неизвестная ошибка');
    } catch (error) {
        res.status(500)
        .json('Внутренняя ошибка сервера');
    }
});

router.post('/profile',
  passport.authenticate('bearer', { session: false }),
    function(req, res) {
      res.json({name: req.user.name, email: req.user.email, id: req.user.userId});
});

router.post('/logout',
  passport.authenticate('bearer', { session: false }), async (req, res) => {
    await dbOauth.delRefreshToken(req.user.userId, req.body.clientId)
    await dbOauth.delAccessToken(req.user.userId, req.body.clientId)
    res.sendStatus(200)
});


module.exports = router;
