const AbstractRepository = require('./AbstractRepository');

module.exports = class PatientRepository extends AbstractRepository {
  constructor() {
    super('patient');
  }

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
