const AbstractRepository = require('./AbstractRepository');

module.exports = class PatientRepository extends AbstractRepository {
  constructor() {
    super('patient');
  }

  /**
   * Obtém um paciente pelo ID, incluindo informações de localização.
   * @param {number|string} id - O ID do paciente a ser obtido.
   * @returns {Promise<Object|null>} O paciente encontrado ou null se não existir.
   * @throws {Error} Lança um erro caso a operação de busca falhe.
   */
  async getById(id) {
    const patient = await this._db.prisma.patient.findUnique({
      where: {
        id: id,
      },
      include: {
        Location: {
          include: {
            City: true,
            State: true,
          },
        },
      },
    });
    return patient;
  }

  /**
   * Obtém uma lista de pacientes com suporte a paginação, filtro e ordenação.
   * @param {number} [offset=1] - O número de registros a serem pulados.
   * @param {number} [limit=5] - O número máximo de registros a serem retornados.
   * @param {string} [filter=''] - Termo para filtrar pacientes por nome ou localização.
   * @param {string} [sortBy='createdAt'] - O campo pelo qual ordenar os resultados.
   * @param {string} [sortOrder='desc'] - A ordem de classificação ('asc' ou 'desc').
   * @returns {Promise<Array<Object>>} Uma lista de pacientes que correspondem aos critérios.
   * @throws {Error} Lança um erro caso a operação de busca falhe.
   */
  async getAll(offset = 1, limit = 5, filter = '', sortBy = 'createdAt', sortOrder = 'desc') {
    const query = {
      select: {
        id: true,
        name: true,
        age: true,
        registeredAt: true,
        Location: {
          select: {
            City: true,
            State: true,
          },
        },
      },
      skip: offset,
      take: limit,
    };
    if (filter)
      query.where = {
        OR: [
          {
            name: {
              contains: filter,
            },
          },
          {
            Location: {
              City: {
                name: {
                  contains: filter,
                },
              },
            },
          },
          {
            Location: {
              State: {
                name: {
                  contains: filter,
                },
              },
            },
          },
        ],
      };
    if (sortBy && sortOrder) query.orderBy = { [sortBy]: sortOrder };
    const patients = await this._db.prisma.patient.findMany(query);
    return patients;
  }
};
