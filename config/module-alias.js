const path = require('path');
const moduleAlias = require('module-alias');

const files = path.resolve(__dirname, '../');

moduleAlias.addAliases({
  '@src': path.join(files, 'src'),
});
