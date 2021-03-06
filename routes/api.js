var express = require('express');
const Cookies = require('cookies')
var router = express.Router();
const db = require('../models');
const {param} = require("express/lib/router"); //contain the Contact model, which is accessible via db.Contact
const {Op} = require('sequelize')
const createError = require("http-errors");
/***
 * making sure we arent getting any weird api request's (which arent from members)
 */
router.all('*', function(req, res, next){
    req.session.isLoggedIn ? next() : res.redirect('/../../login');
})

//router to handle login, checks if mail exists and if password matches
router.get('/', function (req, res, next) {

    db.User.findOne({where: {mail: req.query.mail}})
        .then(instance => {
            if(!instance) {res.json({isValid: false, status: 'user with associated mail was not found'})}
            else {
                if (req.query.password === instance.password) {
                    req.session.isLoggedIn = true;
                    let {firstName, lastName, mail} = instance;
                    req.session.form = {firstName, lastName, mail};
                    res.json({isValid: true, status: 'successfully logged in'})
                } else res.json({isValid: false, status: 'password is wrong'})
            }
        })
        .catch(err => createError({message: err}))


});
/***
 * request for adding picture for current user in data base (if exists will not be added)
 */
router.post('/nasa', function (req, res, next) {
    const mail=req.session.form.mail;
     const {url, sol, earth_date,camera, img_id} = req.body
    db.Nasa.findOrCreate({where: {[Op.and]: {url: url, mail: mail}}, defaults: {url, sol, earth_date, mail, img_id, camera}})
        .then(([model, created]) => {
            created ? res.json({pictureExists:!created,status:'img is already in db' , id: model.id}) :
                res.json({pictureExists:!created,status:'img successfully added'});

        })
        .catch((err) => {
            console.log('***There was an error adding an image', JSON.stringify(err))
            return res.status(400).send(err)
        })
});
/***
 *removing image from image data base for current user
 */
router.delete('/remove', function (req, res, next) {
    db.Nasa.destroy({where: {[Op.and]: {img_id: req.query.id, mail: req.session.form.mail}}}).then(removed=>{
        res.json({removed:removed})
    })
        .catch((err) => next(createError({message: err})))
})

router.delete('/removeall', function (req, res, next) {
    db.Nasa.destroy({where:{mail:req.session.form.mail}}).then(removed=>{
        res.json({removed:removed})
    })
        .catch(err => next(createError({message: err})))

})



module.exports = router;
