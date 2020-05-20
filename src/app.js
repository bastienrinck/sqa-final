const express = require('express');
const router = require('./Survey/SurveyController');

/**
 * Use express controller to handle routes
 * see https://github.com/expressjs/express
  */
const app = express();
app.use(express.json());

/**
 * Loads routes from the SurveyController
  */
app.use('/survey', router);

module.exports = app;
