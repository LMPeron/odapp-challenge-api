const AbstractRepository = require('./AbstractRepository');

module.exports = class LocationRepository extends AbstractRepository {
  constructor() {
    super('location');
  }
};
