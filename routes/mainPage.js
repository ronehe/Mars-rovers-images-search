var express = require('express');
const Cookies = require('cookies')
var router = express.Router();
const db = require('../models');
const {param} = require("express/lib/router"); //contain the Contact model, which is accessible via db.Contact
const {Op} = require('sequelize')

router.get('/', function (req, res, next) {
    console.log('in main page')
    req.session.isLoggedIn ? db.Nasa.findAll({where: {mail: req.session.form.mail}}).then(allData => {
        res.render('mainPage', {data: req.session.form, allData: allData})
    }) : res.redirect('/')
    //req.session.isLoggedIn ? res.render('mainPage', {data: req.session.form}) : res.redirect('/');
})


module.exports = router;
