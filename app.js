'use strict'
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const server = require('http').Server(app);
const io = require('socket.io').listen(server)

app.disable('x-powered-by');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

mongoose.Promise = global.Promise;

const secret = require('./secret.js');
mongoose.connect(secret.url);

app.use(express.static('public'));
app.use(bodyParser.json());

app.use(session({
  secret: secret.session || secret,
  cookie: {maxAge: 7 * 24 * 3600 * 1000},
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());
app.use(cookieParser(secret.session));

app.use(bodyParser.urlencoded({
  extended: true
}));

io.on('connection', function(socket) {
  console.log("a user connected");
  socket.on('disconnect', function() {
    console.log("a user disconnect");
  });
  socket.on('player name', function(name) {
    console.log("the new players name is" + name);
    io.emit('player name', name);
  });
});

require('./routes/gameRoutes')(app);

server.listen(3000, function() {
  console.log('listening on 3000');
});
