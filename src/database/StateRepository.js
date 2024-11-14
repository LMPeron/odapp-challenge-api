const AbstractRepository = require('./AbstractRepository');

module.exports = class StateRepository extends AbstractRepository {
  constructor() {
    super('state');
  }

  async getAll() {
    const states = await this._db.prisma.state.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return states;
  }
};
