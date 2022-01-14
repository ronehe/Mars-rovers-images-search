var express = require('express');
const Cookies = require('cookies')
var router = express.Router();
const db = require('../models');
const {param} = require("express/lib/router"); //contain the Contact model, which is accessible via db.Contact
const {Op} = require('sequelize')

router.get('/', function (req, res, next) {
    req.session.isLoggedIn ?
        res.redirect('/mainPage') :
        res.render('login', {
                form: 'registerMailForm',
                error: req.query.error
            }
        );

});

router.post('/', function (req, res, next) {

    req.session.form = req.body

    let keys = ['keyboard cat']
    const cookies = new Cookies(req, res, {keys: keys})

    // Get the cookie
    // Set the cookie with expiration time 10 seconds (for testing)
    cookies.set('cookieExists', new Date().toISOString(), {signed: true, maxAge: 60 * 1000});


    res.render('login', {
        form: 'registerPasswordForm',
        error: '',
        data: req.session.form
    });

});

router.get('/complete', function (req, res, next) {
    res.redirect('../')
})

router.post('/complete', function (req, res, next) {
    let keys = ['keyboard cat']
    const cookies = new Cookies(req, res, {keys: keys})
    const cookieExists = cookies.get('cookieExists', {signed: true})
    const {firstName, lastName, mail} = req.session.form;
    const {password} = req.body
    if (cookieExists) {
        db.User.findOrCreate({where: {mail: mail}, defaults: {firstName, lastName, mail, password}})
            .then(([model, created]) => {
                req.session.isLoggedIn = created;
                created ?     res.render('login', {
                        form: 'registrationCompleteForm',
                        error: '',
                        data: req.session.form
                    })
                    : res.redirect('/register');
            })
            .catch((err) => {
                console.log('***There was an error creating a contact', JSON.stringify(err))
                return res.status(400).send(err)
            })
    } else res.redirect('/register?error=sessiontimeout')
})




module.exports = router;
