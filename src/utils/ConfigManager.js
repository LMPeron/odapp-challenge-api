module.exports = class ConfigManager {
  constructor() {}
  getConfigurations() {
    return {
      logLevel: process.env.LOG_LEVEL || 'debug',
      rejectUnauthorized: process.env.REQUEST_REJECT_UNAUTHORIZED == 'true' ? true : false,
      listenPort: process.env.PORT || 8085,
    };
  }
};
