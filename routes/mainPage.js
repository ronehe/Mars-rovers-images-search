var express = require('express');
const Cookies = require('cookies')
var router = express.Router();
const db = require('../models');
const {param} = require("express/lib/router"); //contain the Contact model, which is accessible via db.Contact
const {Op} = require('sequelize')
const createError = require("http-errors");

//main page main router
router.get('/', function (req, res, next) {
    console.log('in main page')
    req.session.isLoggedIn
        ? db.Nasa.findAll({where: {mail: req.session.form.mail}}) //fetch all data associated with user
            .then(allData => {
                res.render('mainPage', {data: req.session.form, allData: allData})
            }).catch(err => next(createError({message: err})))

        : res.redirect('/')
})


module.exports = router;
