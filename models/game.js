'use strict'
const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
  password: String,
  owner: String,
  players: [String],
  open: {type: Boolean, default: true }
});

const Game = mongoose.model('Game', gameSchema);

exports.home = function(req, res) {
  res.render('home');
}

exports.create = function(req, res) {
  res.render('create');
}

exports.postcreate = function(req, res) {
 let newGame = new Game({
   password: req.body.password,
   owner: req.body.name,
   players: req.body.name,
   open: true
 });

 newGame.save();
 req.session.owner = true;
 req.session.name = req.body.name;

 res.redirect('/wait/' + newGame.id);
}

exports.join = function(req, res) {
  res.render('join');
}

exports.postjoin = function(req, res) {
  let password = req.body.password;
  Game.findOne({password: password}, function(err, game) {
    if(game && game.open) {
      let query = {password : req.body.password};
      let update = {$push:{players:req.body.name}};
      Game.findOneAndUpdate(query, update, {new: true}, function(err, update) {
        req.session.name = req.body.name;
        res.redirect('/wait/' + game.id);
      })
    } else {
      req.flash('joinError',
      'there is not game with this password waiting for players');
    }
  });
}

exports.wait = function(req, res) {
  let session = req.session;
  let id = req.params.id;
  let owner = session.owner;
  let name = session.name;

  console.log(req.session.owner);
  console.log(req.session.name);

  Game.findById(id, function(err, game) {
    res.render('wait', {
      password: game.password,
      players: game.players,
      owner: owner,
      name: name
    });
  });
}

exports.postwait = function(req, res) {

}

exports.game = function(req, res) {
  res.render('game')
}

exports.postgame = function(req, res) {

}
