const ErrorHandler = require('../utils/ErrorHandler');
const JwtToken = require('../utils/JwtToken');
const Encrypt = require('../utils/Encrypt');
const AdminRepository = require('../database/AdminRepository');

module.exports = class AuthController {
  constructor() {
    this._adminRepository = new AdminRepository();
  }

  /**
   * Renova o token de autenticação para um usuário autenticado.
   * @param {Object} req - O objeto de requisição HTTP, contendo o usuário autenticado.
   * @param {Object} res - O objeto de resposta HTTP para enviar os resultados.
   * @returns {Object} Uma resposta HTTP contendo o novo token e os dados do usuário.
   * @throws {Error} Lança um erro se o usuário não for encontrado ou se a operação falhar.
   */
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

  /**
   * Registra um novo usuário administrador no sistema.
   * @param {Object} req - O objeto de requisição HTTP contendo os dados do usuário a ser cadastrado.
   * @param {Object} res - O objeto de resposta HTTP para enviar os resultados.
   * @returns {Object} Uma resposta HTTP contendo o token de autenticação e os dados do usuário criado.
   * @throws {Error} Lança um erro se o email já estiver cadastrado ou se a operação de cadastro falhar.
   */
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

  /**
   * Autentica um usuário administrador no sistema.
   * @param {Object} req - O objeto de requisição HTTP contendo o email e a senha do usuário.
   * @param {Object} res - O objeto de resposta HTTP para enviar os resultados.
   * @returns {Object} Uma resposta HTTP contendo o token de autenticação e os dados do usuário.
   * @throws {Error} Lança um erro se as credenciais forem inválidas ou se a operação de login falhar.
   */
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
