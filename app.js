const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser')
const passport = require('passport');
const uploadRouter = require('./routes/upload');
const roomRouter = require('./routes/room');
const userRouter = require('./routes/user');
const adRouter = require('./routes/ad');
const callRouter = require('./routes/call');
const cors = require('cors')

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(passport.initialize());
app.use(cors())

require('./helpers/strategies');

app.use(logger('dev'));


app.use((req, res, next) => {
  global.host = req.headers.host
  next()
})


app.use(express.static(__dirname));
app.use('/upload', uploadRouter);
app.use('/user', userRouter);
app.use('/ad', adRouter);
app.use('/call', callRouter);
app.use('/room', roomRouter);

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
  });