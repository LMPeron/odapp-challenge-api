const JwtToken = require('../utils/JwtToken');
const ErrorHandler = require('../utils/ErrorHandler');

module.exports = class Auth {
  constructor() {}

  /**
   * Middleware para verificar a autenticação do usuário.
   * @param {Object} req - Objeto de requisição HTTP contendo o cabeçalho de autorização.
   * @param {Object} res - Objeto de resposta HTTP para enviar os resultados.
   * @param {Function} next - Função que passa o controle para o próximo middleware.
   * @returns {void} Encaminha a requisição para o próximo middleware ou retorna um erro de autenticação.
   * @throws {Error} Lança um erro caso ocorra falha na verificação do token de autenticação.
   */
  async checkAuthentication(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = this.validateAuthHeader(authHeader);
      const { user, jwtToken } = JwtToken.validateToken(token);
      req.user = user;
      req.jwt = jwtToken;
      return next();
    } catch (error) {
      ErrorHandler.http(error, res, 'Something went wrong while checking authentication');
    }
  }

  /**
   * Valida o cabeçalho de autorização e extrai o token.
   * @param {string} authHeader - Cabeçalho de autorização da requisição HTTP.
   * @returns {string} Retorna o token extraído do cabeçalho de autorização.
   * @throws {Error} Lança um erro caso o cabeçalho esteja ausente ou mal formatado.
   */
  validateAuthHeader(authHeader) {
    if (!authHeader) throw { status: 401, message: 'No token provided' };
    const parts = authHeader.split(' ');
    if (!parts.length === 2) throw { status: 401, message: 'Token error' };
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) throw { status: 401, message: 'Wrong formatted token' };
    return token;
  }
};
