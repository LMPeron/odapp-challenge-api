const PatientRepository = require('../database/PatientRepository');
const ErrorHandler = require('../utils/ErrorHandler');

module.exports = class PatientController {
  constructor() {
    this._patientRepository = new PatientRepository();
  }

  async getAll(req, res) {
    try {
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 5;
      const filter = req.query.filter || '';
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'desc';
      const patients = await this._patientRepository.getAll(offset, limit, filter, sortBy, sortOrder);
      let count = await this._patientRepository.getCache(`patients:count`);
      if (!count) {
        count = await this._patientRepository.count();
        await this._patientRepository.setCache(`patients:count`, count);
      }
      return res.status(200).json({ success: true, patients: patients, count: count });
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha ao buscar patientes');
    }
  }

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const patient = await this._patientRepository.getById(id);
      return res.status(200).json({ success: true, patient: patient });
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha ao buscar patiente');
    }
  }

  async create(req, res) {
    try {
      const patient = req.body;
      const createdPatient = await this._patientRepository.create({
        name: patient.name,
        age: patient.age,
        Location: {
          create: {
            City: { connect: { id: patient.city } },
            State: { connect: { id: patient.state } },
          },
        },
      });
      await this._patientRepository.deleteCache(`patients:count`);
      return res.status(200).json({ success: true, data: createdPatient });
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha ao cadastrar patiente');
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const patient = await this._patientRepository.getById(id);
      if (!patient) throw { status: 400, message: 'Patiente não encontrado' };
      const updatedPatient = await this._patientRepository.update(id, {
        name: data.name,
        age: data.age,
        Location: {
          update: {
            City: { connect: { id: data.city } },
            State: { connect: { id: data.state } },
          },
        },
      });
      return res.status(200).json({ success: true, data: updatedPatient });
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha ao atualizar patiente');
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const patient = await this._patientRepository.getById(id);
      if (!patient) throw { status: 400, message: 'Patiente não encontrado' };
      await this._patientRepository.delete(id);
      await this._patientRepository.deleteCache(`patients:count`);
      return res.status(200).json({ success: true });
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha ao deletar patiente');
    }
  }

  async deleteBulk(req, res) {
    try {
      const ids = req.body.ids;
      await this._patientRepository.deleteAll(ids);
      await this._patientRepository.deleteCache(`patients:count`);
      return res.status(200).json({ success: true });
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha ao deletar patientes');
    }
  }
};