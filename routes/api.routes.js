/* eslint-disable linebreak-style */
const express = require('express');
const apiController = require('../controller/api_controller');

const apiRouter = express.Router();
apiRouter.get('/', apiController.docs);
module.exports = apiRouter;
