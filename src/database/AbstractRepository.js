const DatabaseConnection = require('./DatabaseConnection');
const RedisCache = require('../cache/RedisCache');

module.exports = class AbstractRepository {
  constructor(name) {
    if (!name) throw new Error('Repository name is required.');
    this._name = name;
    this._cache = new RedisCache();
    this._db = new DatabaseConnection();
  }

  async count() {
    const count = await this._db.prisma[`${this._name}`].count();
    return count;
  }

  async create(data) {
    const entity = await this._db.prisma[`${this._name}`].create({ data: data });
    return entity;
  }

  async getById(id) {
    const platform = await this._db.prisma[`${this._name}`].findUnique({
      where: {
        id: id,
      },
    });
    return platform;
  }

  async getBy(value, field) {
    const entity = await this._db.prisma[`${this._name}`].findUnique({
      where: {
        [field]: value,
      },
    });
    return entity;
  }

  async update(id, data) {
    const entity = await this._db.prisma[`${this._name}`].update({
      where: {
        id: id,
      },
      data: data,
    });
    return entity;
  }

  async delete(id) {
    const entity = await this._db.prisma[`${this._name}`].delete({
      where: {
        id: id,
      },
    });
    return entity;
  }

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

  async getAll() {
    const entities = await this._db.prisma[`${this._name}`].findMany();
    return entities;
  }

  async getByUnique(field, value) {
    const entity = await this._db.prisma[`${this._name}`].findUnique({ where: { [field]: value } });
    return entity;
  }

  async getCache(key) {
    return await this._cache.get(key);
  }

  async setCache(key, value) {
    await this._cache.set(key, value);
  }

  async deleteCache(key) {
    await this._cache.delete(key);
  }

  async deleteAllCache(keySearch) {
    await this._cache.deleteAll(keySearch);
  }
};
