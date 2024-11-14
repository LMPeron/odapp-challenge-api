const Joi = require('joi');
module.exports = class PatientSchema {
  static create() {
    return Joi.object().keys({
      name: Joi.string().required().min(3).max(100),
      age: Joi.number().required(),
      city: Joi.number().required(),
      state: Joi.number().required(),
    });
  }

  static update() {
    return Joi.object().keys({
      name: Joi.string().required().min(3).max(100),
      age: Joi.number().required(),
      city: Joi.number().required(),
      state: Joi.number().required(),
    });
  }
};
