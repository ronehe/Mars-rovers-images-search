var express = require('express');
const Cookies = require('cookies')
var router = express.Router();
let mail = []

/* GET home page. */
router.get('/resources/:id', function (req, res, next) {
let currentEmail=req.params.id
    if (mail.find(element => {
        return element === currentEmail
    })) {
        // res.json({x: true})
        res.render('index',{title:"leon"})
    } else {
        res.render('index',{title:"leon"})
    }

});
module.exports = router;
