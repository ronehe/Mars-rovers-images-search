var express = require('express');
const Cookies = require('cookies')
var router = express.Router();
const db = require('../models');
const {param} = require("express/lib/router"); //contain the Contact model, which is accessible via db.Contact
const {Op} = require('sequelize')
const createError = require("http-errors");

//router to handle if mail exists
router.get('/:id', function (req, res, next) {
    db.User.findOne({where: {mail: req.params.id}}).then(instance => {
        res.json({mailExists: Boolean(instance)})
    }).catch(err => next(createError({message: err})))
});

module.exports = router;
