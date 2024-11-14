const AuthController = require('../controllers/AuthController');
const AdminRepository = require('../database/AdminRepository');
const JwtToken = require('../utils/JwtToken');
const Encrypt = require('../utils/Encrypt');
const ErrorHandler = require('../utils/ErrorHandler');
const httpMocks = require('node-mocks-http');

jest.mock('../database/AdminRepository');
jest.mock('../utils/JwtToken');
jest.mock('../utils/Encrypt');
jest.mock('../utils/ErrorHandler');

describe('AuthController', () => {
  let authController;
  let req, res;

  beforeEach(() => {
    authController = new AuthController();
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    jest.clearAllMocks();
  });

  describe('renewToken', () => {
    it('should renew token successfully', async () => {
      const userId = '123';
      req.user = userId;
      const user = { id: userId, email: 'test@example.com' };
      AdminRepository.prototype.getById.mockResolvedValue(user);
      JwtToken.generateToken.mockReturnValue('newToken');
      await authController.renewToken(req, res);
      expect(AdminRepository.prototype.getById).toHaveBeenCalledWith(userId);
      expect(JwtToken.generateToken).toHaveBeenCalledWith({ user: userId });
      const data = JSON.parse(res._getData());
      expect(res.statusCode).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.token).toBe('newToken');
      expect(data.data.user).toEqual({ id: userId, email: 'test@example.com' });
    });

    it('should handle user not found', async () => {
      const userId = '123';
      req.user = userId;
      AdminRepository.prototype.getById.mockResolvedValue(null);
      await authController.renewToken(req, res);
      expect(AdminRepository.prototype.getById).toHaveBeenCalledWith(userId);
      expect(ErrorHandler.http).toHaveBeenCalledWith(
        { status: 400, message: 'User not found' },
        res,
        'Failed to Renew Token'
      );
    });

    it('should handle errors', async () => {
      const userId = '123';
      req.user = userId;
      const error = new Error('Database error');
      AdminRepository.prototype.getById.mockRejectedValue(error);
      await authController.renewToken(req, res);
      expect(AdminRepository.prototype.getById).toHaveBeenCalledWith(userId);
      expect(ErrorHandler.http).toHaveBeenCalledWith(error, res, 'Failed to Renew Token');
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const user = { email: 'test@example.com', password: 'password123' };
      req.body = user;
      AdminRepository.prototype.getByUnique.mockResolvedValue(null);
      Encrypt.hash.mockResolvedValue('hashedPassword');
      const createdUser = { id: '123', email: user.email, password: 'hashedPassword' };
      AdminRepository.prototype.create.mockResolvedValue(createdUser);
      JwtToken.generateToken.mockReturnValue('newToken');
      await authController.register(req, res);
      expect(AdminRepository.prototype.getByUnique).toHaveBeenCalledWith('email', user.email);
      expect(Encrypt.hash).toHaveBeenCalledWith(user.password);
      expect(AdminRepository.prototype.create).toHaveBeenCalledWith({
        ...user,
        password: 'hashedPassword',
      });
      expect(JwtToken.generateToken).toHaveBeenCalledWith({ user: '123' });
      const data = JSON.parse(res._getData());
      expect(res.statusCode).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.token).toBe('newToken');
      expect(data.data.user).toEqual({ id: '123', email: user.email });
    });

    it('should handle existing email', async () => {
      const user = { email: 'test@example.com', password: 'password123' };
      req.body = user;
      AdminRepository.prototype.getByUnique.mockResolvedValue(user);
      await authController.register(req, res);
      expect(AdminRepository.prototype.getByUnique).toHaveBeenCalledWith('email', user.email);
      expect(ErrorHandler.http).toHaveBeenCalledWith(
        { status: 400, message: 'Email já cadastrado' },
        res,
        'Falha ao cadastrar'
      );
    });

    it('should handle errors', async () => {
      const user = { email: 'test@example.com', password: 'password123' };
      req.body = user;
      const error = new Error('Database error');
      AdminRepository.prototype.getByUnique.mockRejectedValue(error);
      await authController.register(req, res);
      expect(AdminRepository.prototype.getByUnique).toHaveBeenCalledWith('email', user.email);
      expect(ErrorHandler.http).toHaveBeenCalledWith(error, res, 'Falha ao cadastrar');
    });
  });

  describe('login', () => {
    it('should handle invalid email', async () => {
      req.body = { email: 'nonexistent@example.com', password: 'example' };
      AdminRepository.prototype.getByUnique.mockResolvedValue(null);
      await authController.login(req, res);
      expect(AdminRepository.prototype.getByUnique).toHaveBeenCalledWith('email', 'nonexistent@example.com');
      expect(ErrorHandler.http).toHaveBeenCalledWith(
        { status: 404, message: 'Email inválido.' },
        res,
        'Falha ao Logar'
      );
    });

    it('should handle invalid password', async () => {
      const user = { id: '123', email: 'test@example.com', password: 'hashedPassword' };
      req.body = { email: user.email, password: 'wrongpassword' };
      AdminRepository.prototype.getByUnique.mockResolvedValue(user);
      Encrypt.compare.mockResolvedValue(false);
      await authController.login(req, res);
      expect(AdminRepository.prototype.getByUnique).toHaveBeenCalledWith('email', user.email);
      expect(Encrypt.compare).toHaveBeenCalledWith('wrongpassword', user.password);
      expect(ErrorHandler.http).toHaveBeenCalledWith({ status: 401, message: 'Senha inválida' }, res, 'Falha ao Logar');
    });
    it('should handle errors', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const error = new Error('Database error');
      AdminRepository.prototype.getByUnique.mockRejectedValue(error);
      await authController.login(req, res);
      expect(AdminRepository.prototype.getByUnique).toHaveBeenCalledWith('email', 'test@example.com');
      expect(ErrorHandler.http).toHaveBeenCalledWith(error, res, 'Falha ao Logar');
    });
  });
});
