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

    const idPhoneNumber = await dbUser.getIdNumberOrCreate(number);
    const user = await dbUser.findUserByidPhoneNumber(idPhoneNumber);
    if (user) {return res.status(403).json('Пользователь уже существует')}

    const dataUser = {
        name,
        idPhoneNumber,
        password: authHelper.encryptPassword(password, idPhoneNumber),
        created: Date.now()
    }

    const newUserId = await dbUser.addUser(dataUser);
    if (newUserId[0]) {return res.status(200).json('Пользователь добавлен')}

    res.status(500).json('Ошибка на сервере')
  } catch (error) {
      res.status(500)
      .json('Ошибка на сервере');
  }
});

router.post('/login', async (req, res, next) => {
  try {
      const {username, password} = req.body;

      const idPhoneNumber = await dbUser.getIdNumber(username);
      const user = idPhoneNumber ?
        await dbUser.findUserByidPhoneNumber(idPhoneNumber) : undefined

      if (!user) {return res.status(403).json('Пользователь не найден')}
      
      if (authHelper.checkPassword(password, user.password, user.idPhoneNumber)) {
        return next()
      }
      res.status(403).json('Не верный пароль')
  } catch (error) {
    console.log('error', error)
      res.status(500)
      .json('Ошибка на сервере');
  }
}, oauth2.token)

router.post('/getNewToken', oauth2.token)

router.post('/edit', passport.authenticate('bearer', { session: false }),
  async (req, res) => {
    try {
      const {name, newPassword, password} = req.body;

      if (!await authHelper.checkPassword(password, req.user.password, req.user.idPhoneNumber)) {
        return res.status(403).json('Не верный пароль')
      }
      
      const data = {name}
      data.password = newPassword ?
        authHelper.encryptPassword(newPassword, req.user.idPhoneNumber) :
        undefined

      if (await dbUser.editUser(data, req.user.userId)) {
        return res.status(200).json('Информация обновлена')
      }
      
      return res.status(500).json('Ошибка на сервере')
    } catch (error) {
        res.status(500)
        .json('Ошибка на сервере');
    }
  });

router.post('/getMe', passport.authenticate('bearer', { session: false }),
  async (req, res) => {
    res.json({name: req.user.name})
})

router.post('/logout',
  passport.authenticate('bearer', { session: false }), async (req, res) => {
    await dbOauth.delRefreshToken(req.user.userId, req.body.clientId)
    await dbOauth.delAccessToken(req.user.userId, req.body.clientId)
    res.sendStatus(200)
});

router.post('/getMyData', passport.authenticate('bearer', { session: false }),
  async function(req, res) {
    try {
      const number = await dbUser.getNumberById(req.user.idPhoneNumber)
      res.json({name: req.user.name, number: number, id: req.user.userId});
    } catch (error) {
      res.status(500)
      .json('Ошибка на сервере');
    }
});


module.exports = router;
