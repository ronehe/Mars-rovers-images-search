var express = require('express');
const Cookies = require('cookies')
var router = express.Router();
const db = require('../models');
const {param} = require("express/lib/router"); //contain the Contact model, which is accessible via db.Contact
const {Op} = require('sequelize')

router.get('/', function (req, res, next) {
    req.session.isLoggedIn ? res.redirect('/mainPage') : res.render('login', {
        form: 'loginForm',
        error: req.query.error
    });
})

router.post("/complete", function (req, res) {
    db.User.findOne({where: {mail: req.body.mail}})
        .then(instance => {
            if (req.body.password === instance.password) {
                req.session.isLoggedIn = true;
                let {firstName, lastName, mail} = instance;
                req.session.form = {firstName, lastName, mail};
                res.redirect("/mainPage")
            } else res.redirect("/login?error=password")
        })

        .catch(() => {
            res.redirect("/login?error=mail")
        })
})

module.exports = router;
