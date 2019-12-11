const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');

const bodyParser = require('body-parser')

const roomRouter = require('./routes/room');
const findRouter = require('./routes/find');
const indexRouter = require('./routes/index');
const mapRouter = require('./routes/map');

const app = express();

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(bodyParser());
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use('/room', roomRouter);
app.use('/find', findRouter);
app.use('/map', mapRouter);
app.use('/', indexRouter);

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
  });