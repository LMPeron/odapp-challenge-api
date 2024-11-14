const jwt = require('jsonwebtoken');
const { TOKEN_DURATION, SECRET } = process.env;

module.exports = class JwtToken {
  /**
   * Gera um token JWT com base no payload fornecido e opções de expiração.
   * @param {Object} payload - Dados a serem incluídos no payload do token JWT.
   * @param {string} [expiresIn=TOKEN_DURATION] - Tempo de expiração do token. O padrão é definido pela constante `TOKEN_DURATION`.
   * @returns {string} Retorna o token JWT gerado.
   * @throws {Error} Lança um erro se ocorrer uma falha na geração do token.
   */
  static generateToken(payload, expiresIn = TOKEN_DURATION) {
    const options = { expiresIn, issuer: 'odapp' };
    return jwt.sign(payload, SECRET, options);
  }

  /**
   * Valida um token JWT e retorna o usuário decodificado se o token for válido.
   * @param {string} token - Token JWT a ser validado.
   * @returns {Object} Retorna um objeto contendo o usuário e o token JWT, se o token for válido.
   * @throws {Error} Lança um erro se o token for inválido ou se a validação falhar.
   */
  static validateToken(token) {
    return jwt.verify(token, SECRET, (err, decoded) => {
      if (err) this.throwInvalidToken();
      if (decoded.iss !== 'odapp') this.throwInvalidToken();
      const user = decoded.user;
      if (!user) this.throwInvalidToken();
      return { user: user, jwtToken: token };
    });
  }

  /**
   * Lança um erro indicando que o token é inválido.
   * @throws {Error} Lança um erro com status 401 e mensagem 'Invalid token'.
   */
  static throwInvalidToken() {
    throw { status: 401, message: 'Invalid token' };
  }
};
