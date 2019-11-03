const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');

const bodyParser = require('body-parser')

const roomRouter = require('./routes/room');
const findRouter = require('./routes/find');
const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(bodyParser());

app.use('/room', roomRouter);
app.use('/find', findRouter);
app.use('/', indexRouter);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });