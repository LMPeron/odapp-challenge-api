const AbstractRepository = require('./AbstractRepository');

module.exports = class CityRepository extends AbstractRepository {
  constructor() {
    super('city');
  }

  async getAllByState(stateId) {
    const cities = await this._db.prisma.city.findMany({
      where: {
        stateId: stateId,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return cities;
  }
};
