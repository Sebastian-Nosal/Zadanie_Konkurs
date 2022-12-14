/* eslint-disable linebreak-style */
const express = require('express');

const router = express.Router();
const controller = require('../controller/controller');

router.get('/', controller.renderMainPage);
router.get('/login', controller.renderLoginPage);
router.get('/register', controller.renderRegisterPage);

router.post('/login', controller.handleLogin);
router.post('/register', controller.handleRegister);

module.exports = router;