const PatientRoute = require('../routes/PatientRoute');
const LocationRoute = require('../routes/LocationRoute');
const AuthRoute = require('../routes/AuthRoute');

exports.setRoutes = (app) => {
  app.use('/api/patient', PatientRoute.router);
  app.use('/api/location', LocationRoute.router);
  app.use('/api/auth', AuthRoute.router);
};
