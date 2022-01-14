var express = require('express');
const Cookies = require('cookies')
var router = express.Router();
const db = require('../models'); //contain the Contact model, which is accessible via db.Contact

 router.get('/', function (req, res, next) {
     res.redirect('/login')
 })

// router.get('/', function (req, res, next) {
//     res.redirect('/login')
// })
//
// router.get('/login', function (req, res, next) {
//     req.session.isLoggedIn ? res.redirect('/mainPage') : res.render('login', {
//         form: 'loginForm',
//         error: req.query.error
//     });
// })
//
// /* GET home page. */
 router.get('/gigi/:booboo', function (req, res, next) {
     req.session.isLoggedIn ?
         res.redirect('/mainPage') :
         res.render('login', {
             form: 'registerMailForm',
             error: req.query.error
             }
         );
 });

// router.post('/register', function (req, res, next) {
//
//     req.session.form = req.body
//
//     let keys = ['keyboard cat']
//     const cookies = new Cookies(req, res, {keys: keys})
//
//     // Get the cookie
//     // Set the cookie with expiration time 10 seconds (for testing)
//     cookies.set('cookieExists', new Date().toISOString(), {signed: true, maxAge: 60 * 1000});
//
//
//     res.render('login', {
//         form: 'registerPasswordForm',
//         error: '',
//         data: req.session.form
//     });
//
// });
//
// router.get('/registrationComplete', function (req, res, next) {
//     res.redirect('/')
// })
//
// router.post('/registrationComplete', function (req, res, next) {
//     let keys = ['keyboard cat']
//     const cookies = new Cookies(req, res, {keys: keys})
//     const cookieExists = cookies.get('cookieExists', {signed: true})
//     const {firstName, lastName, mail} = req.session.form;
//     const {password} = req.body
//     if (cookieExists) {
//         db.User.findOrCreate({where: {mail: mail}, defaults: {firstName, lastName, mail, password}})
//             .then(([model, created]) => {
//                 req.session.isLoggedIn = created;
//                 created ? res.render('login', {
//                     form: 'registrationCompleteForm',
//                     error: '',
//                     data: req.session.form
//                 }) : res.redirect('/register');
//             })
//             .catch((err) => {
//                 console.log('***There was an error creating a contact', JSON.stringify(err))
//                 return res.status(400).send(err)
//             })
//     } else res.redirect('/register?error=sessiontimeout')
// })
//
// router.get('/mainPage', function (req, res, next) {
//     console.log('in main page')
//     req.session.isLoggedIn ? db.Nasa.findAll({where: {mail: req.session.form.mail}}).then(allData => {
//         res.render('mainPage', {data: req.session.form, allData: allData})
//     }) : res.redirect('/')
//     //req.session.isLoggedIn ? res.render('mainPage', {data: req.session.form}) : res.redirect('/');
// })
//
//
router.get('/logout', function (req, res, next) {
    req.session.isLoggedIn = false;
    res.redirect('/');
})
//
// router.get('/findall', function (req, res, next) {
//     db.User.findAll({paranoid: false}).then(alldata => {
//         res.send(alldata)
//     }).catch((err) => {
//         console.log("error", JSON.stringify(err));
//         return res.send({message: err})
//     })
// })
//
// router.get('/findalln', function (req, res, next) {
//     db.Nasa.findAll({paranoid: false}).then(alldata => {
//         res.send(alldata)
//     }).catch((err) => {
//         console.log("error", JSON.stringify(err));
//         return res.send({message: err})
//     })
// })
//
//
//
//
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
