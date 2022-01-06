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
module.exports = router;
