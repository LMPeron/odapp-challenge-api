const AbstractRepository = require('./AbstractRepository');

module.exports = class StateRepository extends AbstractRepository {
  constructor() {
    super('state');
  }

  /**
   * Obtém todos os estados, ordenados por nome em ordem ascendente.
   * @returns {Promise<Array<Object>>} Uma lista de estados.
   * @throws {Error} Lança um erro caso a operação de busca falhe.
   */
  async getAll() {
    const states = await this._db.prisma.state.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return states;
  }
};
