var express = require('express');
const Cookies = require('cookies')
const emails = require('../models/ds')
var router = express.Router();

router.get('/', function (req, res, next){
  res.redirect('/login')
})

router.get('/login', function(req, res, next){
  res.render('login');
})

/* GET home page. */
router.get('/register', function(req, res, next) {
  console.log(emails)
  res.render('register', {
    typeName: 'text',
    typeMail: 'email',
      typePassword: 'hidden',
    action: 'register'
  }
  );

});

router.post('/register', function(req, res, next) {

  req.session.form=req.body

  let keys = ['keyboard cat']
  const cookies = new Cookies(req, res, { keys: keys })

  // Get the cookie
    // Set the cookie with expiration time 10 seconds (for testing)
    cookies.set('cookieExists', new Date().toISOString(), { signed: true, maxAge: 10*1000 });


  res.render('register', {

    typeName: 'hidden',
    typeMail: 'hidden',
    typePassword: 'password',
    action: 'registrationComplete'
    });

});

router.post('/registrationComplete', function(req, res, next){
  let keys = ['keyboard cat']
  const cookies = new Cookies(req, res, { keys: keys })

  // Get the cookie
  const cookieExists = cookies.get('cookieExists', { signed: true })
  if(!cookieExists || emails.find(mail => {return mail === req.session.form.email})){
    res.redirect('/register')
  }

  else {
    emails.push(req.session.form.email)
    res.send('<h1>Thank you for registering</h1>');
  }

})
router.get('/registrationComplete', function(req, res, next){
res.redirect('/register')
})

module.exports = router;
