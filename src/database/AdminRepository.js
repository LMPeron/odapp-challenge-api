const AbstractRepository = require('./AbstractRepository');

module.exports = class AdminRepository extends AbstractRepository {
  constructor() {
    super('admin');
  }
};
