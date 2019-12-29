const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser')
const passport = require('passport');
const roomRouter = require('./routes/room');
const findRouter = require('./routes/find');
const indexRouter = require('./routes/index');
const mapRouter = require('./routes/map');
const oauth2 = require('./helpers/oauth2')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

require('./helpers/oauth');

app.post('/oauth/token', oauth2.token);

app.get('/user',
    passport.authenticate('bearer', { session: false }),
        function(req, res) {
            res.json({ user_id: req.user.userId, name: req.user.username, scope: req.authInfo.scope })
        }
);

app.use(logger('dev'));


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