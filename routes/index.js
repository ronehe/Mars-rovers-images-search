var express = require('express');
const Cookies = require('cookies')
var router = express.Router();

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('register', {
    typeName: 'text',
    typeMail: 'email',
      typePassword: 'hidden',
      first:"submit",
      second:"hidden"}
  );

});

router.post('/register', function(req, res, next) {

  req.session.form=req.body

  let keys = ['keyboard cat']
  const cookies = new Cookies(req, res, { keys: keys })

  // Get the cookie
  const cookieExists = cookies.get('cookieExists', { signed: true })
/**
 *if cookie doesnt exists create a new one..
 */
  if (!cookieExists) {
    // Set the cookie with expiration time 10 seconds (for testing)
    cookies.set('cookieExists', new Date().toISOString(), { signed: true, maxAge: 10*1000 });
  }



  res.render('register', {

    typeName: 'hidden',
    typeMail: 'hidden',
    typePassword: 'password',
    first:"hidden",
    second:"submit"
    });

});
module.exports = router;
