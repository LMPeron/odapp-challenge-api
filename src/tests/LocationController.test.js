const httpMocks = require('node-mocks-http');
const LocationController = require('../controllers/LocationController');

jest.mock('../database/StateRepository');
jest.mock('../database/CityRepository');
jest.mock('../utils/ErrorHandler');

const StateRepository = require('../database/StateRepository');
const CityRepository = require('../database/CityRepository');
const ErrorHandler = require('../utils/ErrorHandler');

describe('LocationController', () => {
  let locationController;
  let req;
  let res;
  let stateRepositoryMock;
  let cityRepositoryMock;

  beforeEach(() => {
    StateRepository.mockClear();
    CityRepository.mockClear();
    ErrorHandler.http.mockClear();

    stateRepositoryMock = new StateRepository();
    cityRepositoryMock = new CityRepository();
    locationController = new LocationController();
    locationController._stateRepository = stateRepositoryMock;
    locationController._cityRepository = cityRepositoryMock;
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  describe('getStates', () => {
    it('should retrieve all states successfully', async () => {
      const mockStates = [
        { id: 1, name: 'State A' },
        { id: 2, name: 'State B' },
      ];
      stateRepositoryMock.getAll.mockResolvedValue(mockStates);
      await locationController.getStates(req, res);
      expect(stateRepositoryMock.getAll).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(200);
      const data = res._getJSONData();
      expect(data).toEqual({ success: true, data: mockStates });
    });

    it('should handle errors when retrieving states', async () => {
      const mockError = new Error('Database failure');
      stateRepositoryMock.getAll.mockRejectedValue(mockError);
      await locationController.getStates(req, res);
      expect(stateRepositoryMock.getAll).toHaveBeenCalledTimes(1);
      expect(ErrorHandler.http).toHaveBeenCalledWith(mockError, res, 'Falha ao buscar estados');
    });
  });

  describe('getCities', () => {
    it('should retrieve cities for a given state successfully', async () => {
      const stateId = '1';
      req.params = { stateId };
      const mockCities = [
        { id: 1, name: 'City X', stateId: 1 },
        { id: 2, name: 'City Y', stateId: 1 },
      ];
      cityRepositoryMock.getAllByState.mockResolvedValue(mockCities);
      await locationController.getCities(req, res);
      expect(cityRepositoryMock.getAllByState).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(200);
      const data = res._getJSONData();
      expect(data).toEqual({ success: true, data: mockCities });
    });
    it('should handle errors when retrieving cities', async () => {
      const stateId = '1';
      req.params = { stateId };
      const mockError = new Error('Database failure');
      cityRepositoryMock.getAllByState.mockRejectedValue(mockError);
      await locationController.getCities(req, res);
      expect(cityRepositoryMock.getAllByState).toHaveBeenCalledWith(1);
      expect(ErrorHandler.http).toHaveBeenCalledWith(mockError, res, 'Falha ao buscar cidades');
    });
  });
});
