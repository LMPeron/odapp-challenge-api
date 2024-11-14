const { PrismaClient } = require('@prisma/client');

module.exports = class DatabaseConnection {
  /**
   * Inicializa uma conexão singleton com o banco de dados usando Prisma Client.
   * @constructor
   * @returns {DatabaseConnection} A instância única da classe DatabaseConnection.
   */
  constructor() {
    if (DatabaseConnection.instance) return DatabaseConnection.instance;
    this.prisma = new PrismaClient();
    DatabaseConnection.instance = this;
  }
};
