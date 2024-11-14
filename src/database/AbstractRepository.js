const DatabaseConnection = require('./DatabaseConnection');
const RedisCache = require('../cache/RedisCache');

module.exports = class AbstractRepository {
  constructor(name) {
    if (!name) throw new Error('Repository name is required.');
    this._name = name;
    this._cache = new RedisCache();
    this._db = new DatabaseConnection();
  }

  /**
   * Conta o número total de registros para a entidade atual.
   * @returns {Promise<number>} O número total de registros.
   */
  async count() {
    const count = await this._db.prisma[`${this._name}`].count();
    return count;
  }

  /**
   * Cria um novo registro para a entidade atual.
   * @param {Object} data - Os dados do registro a ser criado.
   * @returns {Promise<Object>} O registro criado.
   */
  async create(data) {
    const entity = await this._db.prisma[`${this._name}`].create({ data: data });
    return entity;
  }

  /**
   * Obtém um registro pelo seu ID.
   * @param {number|string} id - O ID do registro a ser obtido.
   * @returns {Promise<Object|null>} O registro encontrado ou null se não existir.
   */
  async getById(id) {
    const platform = await this._db.prisma[`${this._name}`].findUnique({
      where: {
        id: id,
      },
    });
    return platform;
  }

  /**
   * Obtém um registro pelo valor de um campo específico.
   * @param {any} value - O valor do campo.
   * @param {string} field - O nome do campo.
   * @returns {Promise<Object|null>} O registro encontrado ou null se não existir.
   */
  async getBy(value, field) {
    const entity = await this._db.prisma[`${this._name}`].findUnique({
      where: {
        [field]: value,
      },
    });
    return entity;
  }

  /**
   * Atualiza um registro pelo seu ID.
   * @param {number|string} id - O ID do registro a ser atualizado.
   * @param {Object} data - Os novos dados para atualizar o registro.
   * @returns {Promise<Object>} O registro atualizado.
   */
  async update(id, data) {
    const entity = await this._db.prisma[`${this._name}`].update({
      where: {
        id: id,
      },
      data: data,
    });
    return entity;
  }

  /**
   * Exclui um registro pelo seu ID.
   * @param {number|string} id - O ID do registro a ser excluído.
   * @returns {Promise<Object>} O registro excluído.
   */
  async delete(id) {
    const entity = await this._db.prisma[`${this._name}`].delete({
      where: {
        id: id,
      },
    });
    return entity;
  }

  /**
   * Exclui múltiplos registros com base em uma lista de IDs.
   * @param {Array<number|string>} ids - Os IDs dos registros a serem excluídos.
   * @returns {Promise<Object>} O resultado da operação de exclusão.
   */
  async deleteAll(ids) {
    const entity = await this._db.prisma[`${this._name}`].deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return entity;
  }

  /**
   * Obtém todos os registros da entidade atual.
   * @returns {Promise<Array<Object>>} Uma lista de todos os registros.
   */
  async getAll() {
    const entities = await this._db.prisma[`${this._name}`].findMany();
    return entities;
  }

  /**
   * Obtém um registro único com base em um campo único.
   * @param {string} field - O nome do campo único.
   * @param {any} value - O valor do campo único.
   * @returns {Promise<Object|null>} O registro encontrado ou null se não existir.
   */
  async getByUnique(field, value) {
    const entity = await this._db.prisma[`${this._name}`].findUnique({ where: { [field]: value } });
    return entity;
  }

  /**
   * Obtém um valor do cache Redis com base em uma chave.
   * @param {string} key - A chave do cache.
   * @returns {Promise<any>} O valor armazenado no cache.
   */
  async getCache(key) {
    return await this._cache.get(key);
  }

  /**
   * Armazena um valor no cache Redis com uma chave específica.
   * @param {string} key - A chave do cache.
   * @param {any} value - O valor a ser armazenado.
   * @returns {Promise<void>}
   */
  async setCache(key, value) {
    await this._cache.set(key, value);
  }

  /**
   * Remove um valor do cache Redis com base em uma chave.
   * @param {string} key - A chave do cache.
   * @returns {Promise<void>}
   */
  async deleteCache(key) {
    await this._cache.delete(key);
  }

  /**
   * Remove múltiplos valores do cache Redis com base em um padrão de busca.
   * @param {string} keySearch - O padrão de chave para busca e remoção.
   * @returns {Promise<void>}
   */
  async deleteAllCache(keySearch) {
    await this._cache.deleteAll(keySearch);
  }
};
