const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser')
const passport = require('passport');
const roomRouter = require('./routes/room');
const findRouter = require('./routes/find');
const indexRouter = require('./routes/index');
const mapRouter = require('./routes/map');
const userRouter = require('./routes/user');
const cors = require('cors')
const oauth2 = require('./helpers/oauth2')

const app = express();

app.use(bodyParser());
app.use(passport.initialize());
app.use(cors())

require('./helpers/strategies');

app.post('/oauth/token', oauth2.token);

app.use(logger('dev'));

app.use('/user', userRouter);
app.use('/room', roomRouter);
app.use('/find', findRouter);
app.use('/map', mapRouter);
app.use('/', indexRouter);

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
  });