var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('register', {
    typeName: 'text',
    typeMail: 'email',
      typePassword: 'hidden'});

});
router.post('/register', function(req, res, next) {
  res.render('register', {
    typeName: 'hidden',
    typeMail: 'hidden',
    typePassword: 'password'});

});
module.exports = router;
