var express = require('express');
const Cookies = require('cookies')
var router = express.Router();
const db = require('../models'); //contain the Contact model, which is accessible via db.Contact

 router.get('/', function (req, res, next) {
    res.redirect('/login')
})

router.get('/logout', function (req, res, next) {
    req.session.isLoggedIn = false;
    res.redirect('/');
})

// router.get('/removeall', function (req, res, next) {
//     db.User.destroy({truncate: true, resetIdentity: true})
//         .then(() => {
//             res.send('<h1>Destroyed!</h1>')
//         }).catch(() => {
//     })
// })
//
// router.post("/loginComplete", function (req, res) {
//     db.User.findOne({where: {mail: req.body.mail}})
//         .then(instance => {
//             if (req.body.password === instance.password) {
//                 req.session.isLoggedIn = true;
//                 let {firstName, lastName, mail} = instance;
//                 req.session.form = {firstName, lastName, mail};
//                 res.redirect("/mainPage")
//             } else res.redirect("/login?error=password")
//         })
//
//         .catch(() => {
//             res.redirect("/login?error=mail")
//         })
// })





module.exports = router;
