const PatientSchema = require('../schema/PatientSchema');
const ErrorHandler = require('../utils/ErrorHandler');

module.exports = class PatientValidator {
  constructor() {}

  async create(req, res, next) {
    try {
      const schema = PatientSchema.create();
      const result = schema.validate(req.body);
      if (result.error) ErrorHandler.validator(result.error);
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha em validação ao criar paciente');
    }
    return next();
  }

  async update(req, res, next) {
    try {
      const schema = PatientSchema.update();
      const result = schema.validate(req.body);
      if (result.error) ErrorHandler.validator(result.error);
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha em validação ao atualizar paciente');
    }
    return next();
  }
};
