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

router.get('/', function (req, res, next) {
    console.log(req.query)
    db.User.findOne({where: {mail: req.query.mail}})
        .then(instance => {
            console.log(req.query, instance.password)
            console.log('instance is: ', instance)
            if(req.query.password === instance.password){
                res.json({isValid: true, status: 'successfully registered'})
                req.session.isLoggedIn = true;
            }
            else res.json({isValid: false, status: 'password is wrong'})
        })
        .catch(() => {
        res.json({isValid: false, status: 'user with associated mail was not found'})
    })


});



module.exports = router;
