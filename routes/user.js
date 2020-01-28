const express = require('express');
const router = express.Router();
const dbUser = require('../db/user');
const dbOauth = require('../db/oauth');
const passport = require('passport');
const authHelper = require('../helpers/auth');
const oauth2 = require('../helpers/oauth2');


router.post('/add', async (req, res) => {
  try {
    const {name, number, password} = req.body;

    const idPhoneNumber = await dbUser.findNumberOrCreate(number);
    const user = await dbUser.findUserByidPhoneNumber(idPhoneNumber);
    if (user) {return res.status(403).json('Пользователь уже существует')}

    const dataUser = {
        name,
        idPhoneNumber,
        password: authHelper.encryptPassword(password, idPhoneNumber.toString()),
        created: Date.now()
    }

    const newUserId = await dbUser.addUser(dataUser);
    if (newUserId[0]) {return res.status(200).json('Пользователь добавлен')}

  } catch (error) {
      res.status(500)
      .json('Внутренняя ошибка сервера');
  }
});


router.post('/login', async (req, res, next) => {
  try {
      const {username, password} = req.body;
      const user = await dbUser.findUserByNumber(username)

      if (!user) {return res.status(403).json('Пользователь не найден')}
      if (authHelper.checkPassword(password, user.password, user.number)) {
        return next()
      }
      res.status(403).json('Не верный пароль')
  } catch (error) {
    console.log('error', error)
      res.status(500)
      .json('Ошибка на сервере');
  }
}, oauth2.token)

router.post('/me',
  passport.authenticate('bearer', { session: false }),
    async (req, res) => {
      res.json({name: req.user.name, number: req.user.number})
  })

router.post('/edit',
  passport.authenticate('bearer', { session: false }),
    async (req, res) => {
      try {
          const data = req.body;
          const info = {
              name: data.name,
              number: data.number,
              password: authHelper.encryptPassword(data.password, data.number)
          }
          dbUser.editUser(info, req.user.userId)
          res.status(200)
          .json('User edit');
      } catch (error) {
          res.status(500)
          .json('Error');
      }
  });

router.post('/profile',
  passport.authenticate('bearer', { session: false }),
    function(req, res) {
      res.json({name: req.user.name, number: req.user.number, id: req.user.userId});
});

router.post('/logout',
  passport.authenticate('bearer', { session: false }), async (req, res) => {
    console.log('logout', req.user)
    await dbOauth.delRefreshToken(req.user.userId, req.body.clientId)
    await dbOauth.delAccessToken(req.user.userId, req.body.clientId)
    res.sendStatus(200)
});


module.exports = router;
