// dependencies
const express = require('express');
const router = express.Router();

// load controllers
const indexController = require('../controllers/indexController');

// index route
router.get('/', indexController.getHomepage);

module.exports = router;