import debug from 'debug';
import * as dotenv from 'dotenv';
dotenv.config();

const log: debug.IDebugger = debug('app:config');

const config = {
  mongodb_uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
  mongodb_db: process.env.MONGODB_DB,
  mongodb_col: process.env.MONGODB_COL,
  port: process.env.API_PORT || 4000,
  prefix: process.env.API_PREFIX || 'api'
};

log('config: ', config);
export default config;
