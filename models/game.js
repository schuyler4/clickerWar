'use strict'
const mongoose = require('mongoose');
const express = require('express');

const gameSchema = mongoose.Schema({
  password: String,
  owner: String,
  players: [String],
  open: {type: Boolean, default: true }
});

const Game = mongoose.model('Game', gameSchema);
exports.Game = Game

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
  Game.findOne({password: req.body.password}, function(err, game) {
    if(game && game.open) {

      let password = req.body.password;
      let name = req.body.name;
      let query = {password : password};
      let update = {$push:{players:name}};

      Game.findOneAndUpdate(query, update, {new: true});
      req.session.name = name;
      res.redirect('/wait/' + game.id);

    } else {
      req.flash("joinError", 'there is no game with the password you entered');
      res.redirect('/join')
    }
  });
}

exports.wait = function(req, res) {
  let session = req.session;
  let id = req.params.id;
  let owner = session.owner;
  let name = session.name;

  Game.findById(id, function(err, game) {
    res.render('wait', {
      password: game.password,
      players: game.players,
      owner: owner,
      name: name
    });
  });
}

exports.socketwait = function(socket) {

}

exports.deletegame = function(socket) {
  socket.on()
}

exports.game = function(req, res) {
  res.render('game')
}

exports.postgame = function(req, res) {

}
