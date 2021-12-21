var express = require('express');
const Cookies = require('cookies')
const emails = require('../models/ds')
var router = express.Router();

/* GET home page. */
router.get('/resources/:id', function (req, res, next) {
let currentEmail=req.params.id
    if (emails.find(element => {
        return element === currentEmail
    })) {
        res.json({x: true})
    }
    else {

        res.json({x: false})

    }

});
module.exports = router;
