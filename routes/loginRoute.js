var express = require('express');
const Cookies = require('cookies')
var router = express.Router();
const db = require('../models');
const {param} = require("express/lib/router"); //contain the Contact model, which is accessible via db.Contact
const {Op} = require('sequelize')
const createError = require("http-errors");
/***
 * setting a form of login and errors inside the login ejs page
 */
router.get('/', function (req, res, next) {
    req.session.isLoggedIn ? res.redirect('/mainPage') : res.render('template', {
        form: 'loginForm',
        error: req.query.error
    });
})

//in case trying to reload in page after post
router.get('/complete', function(req, res){
    res.redirect('/login')
})

//validation after login
router.post("/complete", function (req, res, next) {
    db.User.findOne({where: {mail: req.body.mail}})
        .then(instance => {
            if(!instance) {res.redirect('/login?error=mail')} //if not exist, redirect with error
            else {
                if (req.body.password === instance.password) {
                    req.session.isLoggedIn = true; //login
                    let {firstName, lastName, mail} = instance;
                    req.session.form = {firstName, lastName, mail}; //upload user to session
                    res.redirect("/mainPage")
                } else res.redirect("/login?error=password") //if password not match, redirect with error
            }
        })

        .catch((err) => {
            next(createError({message: err}))
        })
})

module.exports = router;
