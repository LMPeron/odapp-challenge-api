const express = require('express');
const AuthMiddleWare = require('../middleware/Auth.js');
const PatientValidator = require('../validator/PacientValidator.js');
const PatientController = require('../controllers/PatientController.js');
const authMiddleWare = new AuthMiddleWare();
const patientValidator = new PatientValidator();
const PatientRouter = express.Router();
const patientController = new PatientController();

PatientRouter.get(
  '/',
  authMiddleWare.checkAuthentication.bind(authMiddleWare),
  patientController.getAll.bind(patientController)
);
PatientRouter.get(
  '/:id',
  authMiddleWare.checkAuthentication.bind(authMiddleWare),
  patientController.getById.bind(patientController)
);

PatientRouter.delete(
  '/:id',
  authMiddleWare.checkAuthentication.bind(authMiddleWare),
  patientController.delete.bind(patientController)
);

PatientRouter.put(
  '/:id',
  authMiddleWare.checkAuthentication.bind(authMiddleWare),
  patientValidator.update.bind(patientValidator),
  patientController.update.bind(patientController)
);

PatientRouter.post(
  '/',
  authMiddleWare.checkAuthentication.bind(authMiddleWare),
  patientValidator.create.bind(patientValidator),
  patientController.create.bind(patientController)
);

PatientRouter.post(
  '/delete/bulk',
  authMiddleWare.checkAuthentication.bind(authMiddleWare),
  patientController.deleteBulk.bind(patientController)
);

module.exports = {
  router: PatientRouter,
};
