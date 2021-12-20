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
        res.json({x: true})
    }
    else {

        res.json({x: false})

    }

});
module.exports = router;
