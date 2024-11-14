const ErrorHandler = require('../utils/ErrorHandler');
const JwtToken = require('../utils/JwtToken');
const Encrypt = require('../utils/Encrypt');
const AdminRepository = require('../database/AdminRepository');

module.exports = class AuthController {
  constructor() {
    this._adminRepository = new AdminRepository();
  }

  async renewToken(req, res) {
    try {
      const { user: userId } = req;
      const user = await this._adminRepository.getById(userId);
      if (!user) throw { status: 400, message: 'User not found' };
      const token = JwtToken.generateToken({ user: user.id });
      delete user.password, delete user.createdAt, delete user.updatedAt;
      return res.status(200).json({ success: true, data: { token: token, user: user } });
    } catch (error) {
      return ErrorHandler.http(error, res, 'Failed to Renew Token');
    }
  }

  async register(req, res) {
    try {
      const user = req.body;
      const existingUser = await this._adminRepository.getByUnique('email', user.email);
      if (existingUser) throw { status: 400, message: 'Email já cadastrado' };
      const hashedPassword = await Encrypt.hash(user.password);
      const createdUser = await this._adminRepository.create({
        ...user,
        password: hashedPassword,
      });
      delete createdUser.password, delete createdUser.createdAt, delete createdUser.updatedAt;
      const token = JwtToken.generateToken({ user: createdUser.id });
      return res.status(200).json({ success: true, data: { token: token, user: createdUser } });
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha ao cadastrar');
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this._adminRepository.getByUnique('email', email);
      if (!user) throw { status: 404, message: 'Email inválido.' };
      if (!(await Encrypt.compare(password, user.password))) throw { status: 401, message: 'Senha inválida' };
      const token = JwtToken.generateToken({ user: user.id });
      delete user.password, delete user.createdAt, delete user.updatedAt;
      return res.status(200).json({ success: true, data: { token: token, user: user } });
    } catch (error) {
      return ErrorHandler.http(error, res, 'Falha ao Logar');
    }
  }
};
