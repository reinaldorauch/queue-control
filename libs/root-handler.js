const rootHandler = require('express').Router();

rootHandler.get('/', (req, res) => {
  res.render('pages/index', { counter: 0 });
});

rootHandler.get('/mesa', (req, res) => {
  res.render('pages/mesa', { counter: 0 });
})

module.exports = rootHandler;
