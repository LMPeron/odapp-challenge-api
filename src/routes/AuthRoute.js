const express = require('express');
const AuthMiddleWare = require('../middleware/Auth.js');
const AuthValidator = require('../validator/AuthValidator.js');
const AuthController = require('../controllers/AuthController.js');
const authMiddleWare = new AuthMiddleWare();
const authValidator = new AuthValidator();
const AuthRouter = express.Router();
const authController = new AuthController();

AuthRouter.post('/register', authValidator.register.bind(authValidator), authController.register.bind(authController));
AuthRouter.post('/login', authValidator.login.bind(authValidator), authController.login.bind(authController));
AuthRouter.post(
  '/renew-token',
  authMiddleWare.checkAuthentication.bind(authMiddleWare),
  authController.renewToken.bind(authController)
);

module.exports = {
  router: AuthRouter,
};
