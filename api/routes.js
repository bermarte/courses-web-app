const controllers = require('./controllers.js');
const express = require('express');

const router = express.Router();

router.get('/', controllers.hello);

// write your routes


module.exports = router;
