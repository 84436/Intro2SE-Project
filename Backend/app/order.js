var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.send('Get all orders.');
});

router.post('/', function (req, res) {
    // Create user
    res.send('Some response.');
});

module.exports.router = router;
