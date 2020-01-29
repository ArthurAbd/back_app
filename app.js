const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser')
const passport = require('passport');
const roomRouter = require('./routes/room');
const findRouter = require('./routes/find');
const indexRouter = require('./routes/index');
const mapRouter = require('./routes/map');
const userRouter = require('./routes/user');
const adRouter = require('./routes/ad');
const cors = require('cors')

const app = express();

app.use(bodyParser());
app.use(passport.initialize());
app.use(cors())
// app.use(function(req, res, next) {
//   console.log('header', req.headers)
//   next()
// })

require('./helpers/strategies');

app.use(logger('dev'));

app.use('/user', userRouter);
app.use('/ad', adRouter);
app.use('/room', roomRouter);
app.use('/find', findRouter);
app.use('/map', mapRouter);
app.use('/', indexRouter);

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
  });