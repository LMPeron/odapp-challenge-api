const AuthSchema = require('../schema/AuthSchema');
const ErrorHandler = require('../utils/ErrorHandler');

module.exports = class AuthValidator {
  constructor() {}

  async register(req, res, next) {
    try {
      const schema = AuthSchema.register();
      const result = schema.validate(req.body);
      if (result.error) ErrorHandler.validator(result.error);
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha em validação ao cadastrar');
    }
    return next();
  }

  async login(req, res, next) {
    try {
      const schema = AuthSchema.login();
      const result = schema.validate(req.body);
      if (result.error) ErrorHandler.validator(result.error);
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha em validação ao logar');
    }
    return next();
  }
};
