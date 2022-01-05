var express = require('express');
const Cookies = require('cookies')
var router = express.Router();
const db = require('../models'); //contain the Contact model, which is accessible via db.Contact

router.get('/', function (req, res, next) {
    res.redirect('/login')
})

router.get('/login', function (req, res, next) {
    req.session.isLoggedIn ? res.redirect('/mainPage') : res.render('login');
})

/* GET home page. */
router.get('/register', function (req, res, next) {
    req.session.isLoggedIn ?
        res.redirect('/mainPage') :
        res.render('register', {
                typeName: 'text',
                typeMail: 'email',
                typePassword: 'hidden',
                firstPageFormType: 'submit',
                secondPageFormType: 'hidden',
                data: 'Sign up'
            }
        );

});

router.post('/register', function (req, res, next) {

    req.session.form = req.body

    let keys = ['keyboard cat']
    const cookies = new Cookies(req, res, {keys: keys})

    // Get the cookie
    // Set the cookie with expiration time 10 seconds (for testing)
    cookies.set('cookieExists', new Date().toISOString(), {signed: true, maxAge: 60 * 1000});


    res.render('register', {

        typeName: 'hidden',
        typeMail: 'hidden',
        typePassword: 'password',
        firstPageFormType: 'hidden',
        secondPageFormType: 'submit',
        data: 'Hello ' + req.session.form.firstName + '! Just a few more steps...'
    });

});

router.get('/registrationComplete', function (req, res, next) {
    res.redirect('/')
})

router.post('/registrationComplete', function (req, res, next) {
    let keys = ['keyboard cat']
    const cookies = new Cookies(req, res, {keys: keys})


    // Get the cookie
    const cookieExists = cookies.get('cookieExists', {signed: true})
    if (!cookieExists /*|| users.find(req.session.form.email)*/) {
        res.redirect('/register')
    } else {
        req.session.isLoggedIn = true;
        const {firstName, lastName, mail} = req.session.form;
        const {password} = req.body
        return db.User.create({firstName, lastName, mail, password})
            .then((user) => res.render('registrationComplete'))
            .catch((err) => {
                console.log('***There was an error creating a contact', JSON.stringify(err))
                return res.status(400).send(err)
            })
    }

})

router.get('/mainPage', function (req, res, next) {
    req.session.isLoggedIn ? res.render('mainPage', {data: req.session.form}) : res.redirect('/');
})


router.get('/logout', function (req, res, next) {
    req.session.isLoggedIn = false;
    res.redirect('/');
})

router.get('/findall', function (req, res, next) {
    db.User.findAll().then(alldata => {
        res.send(alldata)
    }).catch((err) => {
        console.log("error", JSON.stringify(err));
        return res.send({message: err})
    })
})

router.get('/removeall', function (req, res, next) {
    db.User.findAll().then(alldata => {
        alldata.forEach(data => {
            data.destroy().catch(err => console.log("err"))
        })
    }).then(() => {
        res.send('<h1>Destroyed!</h1>')
    })
})
module.exports = router;
