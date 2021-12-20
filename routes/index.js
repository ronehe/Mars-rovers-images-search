var express = require('express');
const Cookies = require('cookies')
var router = express.Router();

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('register', {
    typeName: 'text',
    typeMail: 'email',
      typePassword: 'hidden'});

});

router.post('/register', function(req, res, next) {

  let keys = ['keyboard cat']
  const cookies = new Cookies(req, res, { keys: keys })

  // Get the cookie
  const emailExists = cookies.get('emailExists', { signed: true })

  if (!emailExists) {
    // Set the cookie with expiration time 10 seconds (for testing)
    cookies.set('emailExists', new Date().toISOString(), { signed: true, maxAge: 10*1000 });
    res.render('firstvisit', {title: 'Firt visit with cookie', firstvisit: true});
  }
  else
    res.render('firstvisit', { title: 'Firt visit with cookie', firstvisit: false });


  res.render('register', {
    typeName: 'hidden',
    typeMail: 'hidden',
    typePassword: 'password'});

});
module.exports = router;
