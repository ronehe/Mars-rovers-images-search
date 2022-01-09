var express = require('express');
const Cookies = require('cookies')
var router = express.Router();
const db = require('../models');
const {param} = require("express/lib/router"); //contain the Contact model, which is accessible via db.Contact
const {Op} = require('sequelize')

router.all('*', function(req, res, next){
    req.session.isLoggedIn ? next() : res.redirect('/../../login');
})
/* GET home page. */
router.get('/resources/:id', function (req, res, next) {
    db.User.findOne({where: {mail: req.params.id}}).then(instance => {
        res.json({mailExists: Boolean(instance)})
    }).catch(err => console.log(err))
});

router.get('/', function (req, res, next) {

    db.User.findOne({where: {mail: req.query.mail}})
        .then(instance => {
            if (req.query.password === instance.password) {
                req.session.isLoggedIn = true;
                let {firstName, lastName, mail} = instance;
                req.session.form = {firstName, lastName, mail};
                res.json({isValid: true, status: 'successfully logged in'})
            } else res.json({isValid: false, status: 'password is wrong'})
        })
        .catch(() => {
            res.json({isValid: false, status: 'user with associated mail was not found'})
        })


});

router.post('/nasa', function (req, res, next) {

    console.log('before')
    const mail=req.session.form.mail;
     const {url, sol, earth_date} = req.body

    console.log("im mail :"+mail)


    db.Nasa.findOrCreate({where: {[Op.and]: {url: url, mail: mail}}, defaults: {url, sol, earth_date, mail}})
        .then(([model, created]) => {
            created ? res.json({pictureExists:created,status: 'img successfully added'}) :
                res.json({pictureExists:created,status:'img is already in db'});
            console.log(model, created);
        })
        .catch((err) => {
            console.log('***There was an error adding an image', JSON.stringify(err))
            return res.status(400).send(err)
        })
});


module.exports = router;
