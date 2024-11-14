const AbstractRepository = require('./AbstractRepository');

module.exports = class CityRepository extends AbstractRepository {
  constructor() {
    super('city');
  }

  /**
   * Obtém todas as cidades de um estado específico.
   * @param {number|string} stateId - O ID do estado para o qual obter as cidades.
   * @returns {Promise<Array<Object>>} Uma lista de cidades ordenadas por nome.
   * @throws {Error} Lança um erro caso a operação de busca falhe.
   */
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
