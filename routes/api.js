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
    db.User.findOne({where: {mail: req.params.mail}})
        .catch(() => {
        res.json({isValid: false, status: 'user with associated mail was not found'})
    })
        .then(instance => {
            if(req.params.password === instance.password){
                res.json({isValid: true, status: 'successfully registered'})
                req.session.isLoggedIn = true;
            }
            else res.json({isValid: false, status: 'password is wrong'})
        }).catch(err => console.log(err))

});



module.exports = router;
