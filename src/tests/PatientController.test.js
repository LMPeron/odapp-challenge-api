const PatientController = require('../controllers/PatientController');
const ErrorHandler = require('../utils/ErrorHandler');

jest.mock('../database/PatientRepository');
jest.mock('../utils/ErrorHandler');

describe('PatientController', () => {
  let patientController;
  let req;
  let res;

  beforeEach(() => {
    patientController = new PatientController();
    req = {
      params: {},
      query: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    ErrorHandler.http = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all patients with count', async () => {
      const patients = [{ id: 1, name: 'John Doe', age: 30 }];
      const count = 1;
      patientController._patientRepository.getAll.mockResolvedValue(patients);
      patientController._patientRepository.getCache.mockResolvedValue(null);
      patientController._patientRepository.count.mockResolvedValue(count);
      patientController._patientRepository.setCache.mockResolvedValue();
      await patientController.getAll(req, res);
      expect(patientController._patientRepository.getAll).toHaveBeenCalled();
      expect(patientController._patientRepository.getCache).toHaveBeenCalledWith('patients:count');
      expect(patientController._patientRepository.count).toHaveBeenCalled();
      expect(patientController._patientRepository.setCache).toHaveBeenCalledWith('patients:count', count);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, patients, count });
    });

    it('should handle errors in getAll', async () => {
      const error = new Error('Database error');
      patientController._patientRepository.getAll.mockRejectedValue(error);
      await patientController.getAll(req, res);
      expect(ErrorHandler.http).toHaveBeenCalledWith(error, res, 'Falha ao buscar patientes');
    });
  });

  describe('getById', () => {
    it('should return patient by id', async () => {
      const patient = { id: 1, name: 'John Doe', age: 30 };
      req.params.id = '1';
      patientController._patientRepository.getById.mockResolvedValue(patient);
      await patientController.getById(req, res);
      expect(patientController._patientRepository.getById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, patient });
    });

    it('should handle errors in getById', async () => {
      const error = new Error('Database error');
      req.params.id = '1';
      patientController._patientRepository.getById.mockRejectedValue(error);
      await patientController.getById(req, res);
      expect(ErrorHandler.http).toHaveBeenCalledWith(error, res, 'Falha ao buscar patiente');
    });
  });

  describe('create', () => {
    it('should create a new patient', async () => {
      const patientData = { name: 'John Doe', age: 30, city: 1, state: 1 };
      const createdPatient = { id: 1, ...patientData };
      req.body = patientData;
      patientController._patientRepository.create.mockResolvedValue(createdPatient);
      patientController._patientRepository.deleteCache.mockResolvedValue();
      await patientController.create(req, res);
      expect(patientController._patientRepository.create).toHaveBeenCalledWith({
        name: patientData.name,
        age: patientData.age,
        Location: {
          create: {
            City: { connect: { id: patientData.city } },
            State: { connect: { id: patientData.state } },
          },
        },
      });
      expect(patientController._patientRepository.deleteCache).toHaveBeenCalledWith('patients:count');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: createdPatient });
    });

    it('should handle errors in create', async () => {
      const error = new Error('Database error');
      const patientData = { name: 'John Doe', age: 30, city: 1, state: 1 };
      req.body = patientData;
      patientController._patientRepository.create.mockRejectedValue(error);
      await patientController.create(req, res);
      expect(ErrorHandler.http).toHaveBeenCalledWith(error, res, 'Falha ao cadastrar patiente');
    });
  });

  describe('update', () => {
    it('should update an existing patient', async () => {
      const id = 1;
      const patientData = { name: 'John Doe', age: 31, city: 2, state: 2 };
      const existingPatient = { id, name: 'John Doe', age: 30 };
      const updatedPatient = { id, ...patientData };
      req.params.id = String(id);
      req.body = patientData;
      patientController._patientRepository.getById.mockResolvedValue(existingPatient);
      patientController._patientRepository.update.mockResolvedValue(updatedPatient);
      await patientController.update(req, res);
      expect(patientController._patientRepository.getById).toHaveBeenCalledWith(id);
      expect(patientController._patientRepository.update).toHaveBeenCalledWith(id, {
        name: patientData.name,
        age: patientData.age,
        Location: {
          update: {
            City: { connect: { id: patientData.city } },
            State: { connect: { id: patientData.state } },
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: updatedPatient });
    });

    it('should handle patient not found in update', async () => {
      const id = 1;
      req.params.id = String(id);
      req.body = {};
      patientController._patientRepository.getById.mockResolvedValue(null);
      await patientController.update(req, res);
      const error = { status: 400, message: 'Patiente não encontrado' };
      expect(ErrorHandler.http).toHaveBeenCalledWith(error, res, 'Falha ao atualizar patiente');
    });

    it('should handle errors in update', async () => {
      const id = 1;
      const error = new Error('Database error');
      req.params.id = String(id);
      req.body = {};
      patientController._patientRepository.getById.mockRejectedValue(error);
      await patientController.update(req, res);
      expect(ErrorHandler.http).toHaveBeenCalledWith(error, res, 'Falha ao atualizar patiente');
    });
  });

  describe('delete', () => {
    it('should delete an existing patient', async () => {
      const id = 1;
      const existingPatient = { id, name: 'John Doe', age: 30 };
      req.params.id = String(id);
      patientController._patientRepository.getById.mockResolvedValue(existingPatient);
      patientController._patientRepository.delete.mockResolvedValue();
      patientController._patientRepository.deleteCache.mockResolvedValue();
      await patientController.delete(req, res);
      expect(patientController._patientRepository.getById).toHaveBeenCalledWith(id);
      expect(patientController._patientRepository.delete).toHaveBeenCalledWith(id);
      expect(patientController._patientRepository.deleteCache).toHaveBeenCalledWith('patients:count');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should handle patient not found in delete', async () => {
      const id = 1;
      req.params.id = String(id);
      patientController._patientRepository.getById.mockResolvedValue(null);
      await patientController.delete(req, res);
      const error = { status: 400, message: 'Patiente não encontrado' };
      expect(ErrorHandler.http).toHaveBeenCalledWith(error, res, 'Falha ao deletar patiente');
    });

    it('should handle errors in delete', async () => {
      const id = 1;
      const error = new Error('Database error');
      req.params.id = String(id);
      patientController._patientRepository.getById.mockRejectedValue(error);
      await patientController.delete(req, res);
      expect(ErrorHandler.http).toHaveBeenCalledWith(error, res, 'Falha ao deletar patiente');
    });
  });

  describe('deleteBulk', () => {
    it('should delete multiple patients', async () => {
      const ids = [1, 2, 3];
      req.body.ids = ids;
      patientController._patientRepository.deleteAll.mockResolvedValue();
      patientController._patientRepository.deleteCache.mockResolvedValue();
      await patientController.deleteBulk(req, res);
      expect(patientController._patientRepository.deleteAll).toHaveBeenCalledWith(ids);
      expect(patientController._patientRepository.deleteCache).toHaveBeenCalledWith('patients:count');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should handle errors in deleteBulk', async () => {
      const error = new Error('Database error');
      req.body.ids = [1, 2, 3];
      patientController._patientRepository.deleteAll.mockRejectedValue(error);
      await patientController.deleteBulk(req, res);
      expect(ErrorHandler.http).toHaveBeenCalledWith(error, res, 'Falha ao deletar patientes');
    });
  });
});
