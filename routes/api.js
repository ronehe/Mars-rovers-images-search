var express = require('express');
const Cookies = require('cookies')
var router = express.Router();
const db = require('../models'); //contain the Contact model, which is accessible via db.Contact



/* GET home page. */
router.get('/resources/:id', function (req, res, next) {
    db.User.findOne({where: {mail: req.params.id}}).then(instance => {
        res.json({mailExists: Boolean(instance)})
    }).catch(err => console.log(err))
});

router.get('/resources/:mail/:password', function (req, res, next) {
    db.User.findOne({where: {mail: req.params.mail}}).then(instance => {
        console.log(instance)
        res.json({isValid: instance.password === req.params.password})
    }).catch(err => console.log(err))
});

module.exports = router;
