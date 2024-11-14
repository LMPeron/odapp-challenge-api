const LocationRepository = require('../database/LocationRepository');
const StateRepository = require('../database/StateRepository');
const CityRepository = require('../database/CityRepository');
const ErrorHandler = require('../utils/ErrorHandler');

module.exports = class LocationController {
  constructor() {
    this._locationRepository = new LocationRepository();
    this._stateRepository = new StateRepository();
    this._cityRepository = new CityRepository();
  }

  /**
   * Obtém a lista de estados do banco de dados.
   * @param {Object} _req - O objeto de requisição (não utilizado neste método).
   * @param {Object} res - O objeto de resposta HTTP para enviar os resultados.
   * @returns {Object} Uma resposta HTTP contendo a lista de estados e o status de sucesso.
   * @throws {Error} Lança um erro caso a busca falhe.
   */
  async getStates(_req, res) {
    try {
      const states = await this._stateRepository.getAll();
      return res.status(200).json({ success: true, data: states });
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha ao buscar estados');
    }
  }

  /**
   * Obtém a lista de cidades de um estado específico.
   * @param {Object} req - O objeto de requisição contendo o ID do estado como parâmetro.
   * @param {Object} res - O objeto de resposta HTTP para enviar os resultados.
   * @returns {Object} Uma resposta HTTP contendo a lista de cidades do estado especificado e o status de sucesso.
   * @throws {Error} Lança um erro caso a busca falhe.
   */
  async getCities(req, res) {
    try {
      const { stateId } = req.params;
      const stateIdNumber = Number(stateId);
      const cities = await this._cityRepository.getAllByState(stateIdNumber);
      return res.status(200).json({ success: true, data: cities });
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha ao buscar cidades');
    }
  }
};
