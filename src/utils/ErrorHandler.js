module.exports = class ErrorHandler {
  /**
   * Manipula erros HTTP e envia uma resposta ao cliente.
   * @param {Object} error - Objeto de erro contendo detalhes do erro.
   * @param {Object} response - Objeto de resposta HTTP para enviar a resposta ao cliente.
   * @param {string} contextMessage - Mensagem contextual adicional a ser incluída na resposta.
   * @returns {Object} Retorna a resposta HTTP com o status e mensagem do erro.
   */
  static http(error, response, contextMessage) {
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';
    console.log(error);
    console.error(error);
    delete error.status;
    delete error.message;
    return response.status(status).send({
      success: false,
      message: `${contextMessage} - ${message ?? ''}`,
    });
  }

  /**
   * Manipula erros de validação e lança uma exceção se o erro não for tratado.
   * @param {Object|string} err - Objeto ou mensagem de erro a ser tratado.
   * @throws {Error} Lança um erro se o erro não for uma instância de `Error` ou se o erro não estiver tratado.
   */
  static validator(err) {
    if (!err) return;
    if (err instanceof Error) {
      if (err.handled) throw err;
      err.handled = true;
      console.error('Handled error:', err);
      throw err;
    }
    let msg = typeof err === 'string' ? err : 'Something went wrong with validation.';
    console.error(msg);
    let hError = new Error(msg);
    hError.handled = true;
    throw hError;
  }
};
