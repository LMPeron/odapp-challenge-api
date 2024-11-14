const PatientRepository = require('../database/PatientRepository');
const ErrorHandler = require('../utils/ErrorHandler');

module.exports = class PatientController {
  constructor() {
    this._patientRepository = new PatientRepository();
  }

  /**
   * Obtém uma lista de pacientes com suporte a paginação, filtro e ordenação.
   * @param {Object} req - O objeto de requisição HTTP contendo parâmetros de consulta.
   * @param {Object} res - O objeto de resposta HTTP para enviar os resultados.
   * @returns {Object} Uma resposta HTTP contendo a lista de pacientes e a contagem total.
   * @throws {Error} Lança um erro caso a busca falhe.
   */
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
      return ErrorHandler.http(error, res, 'Falha ao buscar pacientes');
    }
  }

  /**
   * Obtém os detalhes de um paciente específico pelo ID.
   * @param {Object} req - O objeto de requisição HTTP contendo o ID do paciente nos parâmetros.
   * @param {Object} res - O objeto de resposta HTTP para enviar os resultados.
   * @returns {Object} Uma resposta HTTP contendo os dados do paciente.
   * @throws {Error} Lança um erro caso a busca falhe ou o paciente não seja encontrado.
   */
  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const patient = await this._patientRepository.getById(id);
      return res.status(200).json({ success: true, patient: patient });
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha ao buscar paciente');
    }
  }

  /**
   * Cria um novo paciente no sistema.
   * @param {Object} req - O objeto de requisição HTTP contendo os dados do paciente no corpo da requisição.
   * @param {Object} res - O objeto de resposta HTTP para enviar os resultados.
   * @returns {Object} Uma resposta HTTP contendo os dados do paciente criado.
   * @throws {Error} Lança um erro caso a criação falhe.
   */
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
      return ErrorHandler.http(error, res, 'Falha ao cadastrar paciente');
    }
  }

  /**
   * Atualiza os dados de um paciente existente.
   * @param {Object} req - O objeto de requisição HTTP contendo o ID do paciente nos parâmetros e os dados atualizados no corpo.
   * @param {Object} res - O objeto de resposta HTTP para enviar os resultados.
   * @returns {Object} Uma resposta HTTP contendo os dados do paciente atualizado.
   * @throws {Error} Lança um erro caso o paciente não seja encontrado ou a atualização falhe.
   */
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
      return ErrorHandler.http(error, res, 'Falha ao atualizar paciente');
    }
  }

  /**
   * Exclui um paciente do sistema pelo ID.
   * @param {Object} req - O objeto de requisição HTTP contendo o ID do paciente nos parâmetros.
   * @param {Object} res - O objeto de resposta HTTP para confirmar a exclusão.
   * @returns {Object} Uma resposta HTTP confirmando o sucesso da operação.
   * @throws {Error} Lança um erro caso o paciente não seja encontrado ou a exclusão falhe.
   */
  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const patient = await this._patientRepository.getById(id);
      if (!patient) throw { status: 400, message: 'Patiente não encontrado' };
      await this._patientRepository.delete(id);
      await this._patientRepository.deleteCache(`patients:count`);
      return res.status(200).json({ success: true });
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha ao deletar paciente');
    }
  }

  /**
   * Exclui múltiplos pacientes do sistema.
   * @param {Object} req - O objeto de requisição HTTP contendo um array de IDs dos pacientes a serem excluídos no corpo.
   * @param {Object} res - O objeto de resposta HTTP para confirmar a exclusão.
   * @returns {Object} Uma resposta HTTP confirmando o sucesso da operação.
   * @throws {Error} Lança um erro caso a exclusão falhe.
   */
  async deleteBulk(req, res) {
    try {
      const ids = req.body.ids;
      await this._patientRepository.deleteAll(ids);
      await this._patientRepository.deleteCache(`patients:count`);
      return res.status(200).json({ success: true });
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha ao deletar pacientes');
    }
  }
};
