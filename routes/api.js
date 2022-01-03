var express = require('express');
const Cookies = require('cookies')
var router = express.Router();



/* GET home page. */
router.get('/resources/:id', function (req, res, next) {
    res.json({mailExists: false/*Boolean(users.find(req.params.id))*/})
});
module.exports = router;
