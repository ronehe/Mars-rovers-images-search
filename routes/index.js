var express = require('express');
const Cookies = require('cookies')
var router = express.Router();
const db = require('../models'); //contain the Contact model, which is accessible via db.Contact


//main router
 router.get('/', function (req, res, next) {
    res.redirect('/login')
})

router.get('/logout', function (req, res, next) {
    req.session.isLoggedIn = false;
    res.redirect('/');
})






module.exports = router;
