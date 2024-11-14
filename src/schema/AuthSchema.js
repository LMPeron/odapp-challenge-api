const Joi = require('joi');

module.exports = class AuthSchema {
  static register() {
    return Joi.object().keys({
      name: Joi.string().required().min(3).max(20),
      email: Joi.string().required().max(250).email(),
      password: Joi.string().required().min(6).max(50),
    });
  }

  static login() {
    return Joi.object().keys({
      email: Joi.string().required().max(250).email(),
      password: Joi.string().required().min(6).max(50),
    });
  }
};
