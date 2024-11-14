const bcrypt = require('bcryptjs');
const md5 = require('md5');

module.exports = class Encrypt {
  static async hash(value, saltNumber = 10) {
    const salt = await bcrypt.genSalt(saltNumber);
    return bcrypt.hash(value, salt);
  }

  static async compare(value, hash) {
    return await bcrypt.compare(value, hash);
  }

  static externalCompare(value, encoded) {
    return md5(value) === encoded;
  }

  static md5(value) {
    return md5(value);
  }
};
