var express = require('express');
const Cookies = require('cookies')
const users = require('../models/ds')
var router = express.Router();

/* GET home page. */
router.get('/resources/:id', function (req, res, next) {
    res.json({mailExists: Boolean(users.find(req.params.id))})
});
module.exports = router;
