module.exports = function(app) {
  const game = require('../models/game');
  app.get('/', game.home);

  app.get('/create', game.create);
  app.post('/create', game.postcreate);

  app.get('/join', game.join);
  app.post('/join', game.postjoin);

  app.get('/wait/:id', game.wait);
  app.post('/wait', game.postwait);

  app.get('/game', game.game);
  app.post('/game', game.postgame);
}
