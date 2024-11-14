const { PrismaClient } = require('@prisma/client');

module.exports = class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) return DatabaseConnection.instance;
    this.prisma = new PrismaClient();
    DatabaseConnection.instance = this;
  }
};
