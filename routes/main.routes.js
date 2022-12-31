const express = require('express');
const cors = require('cors')

const router = express.Router();
router.use(cors())
const controller = require('../controller/controller');
router.get('/', controller.renderMainPage);
router.get('/login', controller.renderLoginPage);
router.get('/register', controller.renderRegisterPage);

router.post('/login', controller.handleLogin);
router.post('/register', controller.handleRegister);
router.post('/logout', controller.handleLogOut)
module.exports = router;
