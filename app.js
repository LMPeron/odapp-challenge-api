require('dotenv/config');
require('./config/module-alias.js');
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const log4js = require('log4js');
log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: 'application.log' },
  },
  categories: {
    default: { appenders: ['out', 'app'], level: 'info' },
  },
});
const cors = require('cors');
const listEndpoints = require('express-list-endpoints');
const ConfigManager = require('./src/utils/ConfigManager.js');

/**
 * The server.
 *
 * @class Server
 */
class Server {
  static bootstrap() {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    this.loadConfiguration();
    this.app = express();
    this.config();
    this.registerAPIRoutes();
    this.prettyPrintRegisteredRoutes();
    this.server = http.createServer(this.app);
    this.listen();
  }

  loadConfiguration() {
    const configManager = new ConfigManager();
    global.conf = configManager.getConfigurations();
  }

  /**
   * Configura a aplicação
   *
   * @class Server
   * @method config
   */
  config() {
    this.app.use(cors());
    this.app.set('trust proxy', true);
    this.port = global.conf.listenPort;

    this.app.use(bodyParser.json({ limit: '20mb' }));
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(helmet());
    this.app.use(this.configureOptionsMethod);
    process.on('unhandledRejection', (reason, p) => {
      console.log('Unhandled exception', reason, p);
      throw reason;
    });
    console.log('Server started at ' + new Date());
  }

  configureOptionsMethod(req, res, next) {
    if (req.method === 'OPTIONS') {
      res.status(200).end();
    } else {
      next();
    }
  }

  /**
   * Cria as rotas da API.
   *
   * @class Server
   * @method api
   */
  registerAPIRoutes() {
    this._router = require('./src/api/index.js');
    this._router.setRoutes(this.app);
  }

  prettyPrintRegisteredRoutes() {
    let routesToPrint = listEndpoints(this.app);
    console.log(`REGISTERED ROUTES:`);

    routesToPrint.forEach((r) => {
      console.log(r.path.replace('\\', ''));
      console.log('\t- ' + r.methods.join(' | '));
    });
    console.log(``);
  }

  /**
   * Start HTTP server listening
   */
  listen() {
    this.express_server = this.server.listen(this.port);
    this.server.on('error', (error) => {
      if (error.syscall !== 'listen') throw error;
      const bind = typeof this.port === 'string' ? `Pipe ${this.port}` : `Port ${this.port}`;
      switch (error.code) {
        case 'EACCES':
          console.error('requires elevated privileges');
          process.exit(1);
        case 'EADDRINUSE':
          console.error(bind, ' is already in use');
          process.exit(1);
        default:
          throw error;
      }
    });
    this.server.on('listening', () => {
      console.log('Server ready. Listening on port ', this.port);
    });
  }
}

const server = Server.bootstrap();
exports.express_server = server.express_server;
exports.app = server.app;
