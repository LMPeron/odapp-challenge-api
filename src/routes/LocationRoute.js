const express = require('express');
const LocationController = require('../controllers/LocationController.js');
const LocationRouter = express.Router();
const locationController = new LocationController();

LocationRouter.get('/states', locationController.getStates.bind(locationController));
LocationRouter.get('/cities/:stateId', locationController.getCities.bind(locationController));

module.exports = {
  router: LocationRouter,
};
