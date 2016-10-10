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

require('./routes/gameRoutes')(app);

const game = require('./models/game');
io.on('connection', function(socket) {
  socket.on('delete game', function(password) {
    game.Game.findOneAndRemove({password: password}, function(err) {
      if(err)
        console.error(err);
    });
    console.log("deleted game with password" + password);
  });

  socket.on('player name', function(data) {
    let password = data.password;
    let name = data.name;

    game.Game.findOne({password: password}, function(err, game) {
      if(game && game.open) {
          console.log(data.name + " joined the game");
          io.emit('player name', data.name);
      }
    });
  });

})

server.listen(3000, function() {
  console.log('listening on 3000');
});
