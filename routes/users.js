var express = require('express');
var router = express.Router();
var userCtlr = require('../controllers/user.controller');

router.post('/upload-data', userCtlr.uploadData);

router.get('/get-policy/:userId', userCtlr.getPolicyByUsername);

router.get('/get-users-policy', userCtlr.getUsersPolicy);

module.exports = router;
