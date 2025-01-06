import mongoose from 'mongoose';
import debug from 'debug';
import config from '../config';

const log: debug.IDebugger = debug('app:mongoose-service');

class MongooseService {
  private count = 0;
  private url = config.mongodb_uri;

  private mongooseOptions = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false // Don't build indexes
  };

  constructor() {
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }

  connectWithRetry = async () => {
    log('Intentando conectar con MongoDB (se reintentará de ser necesario)');
    mongoose
      .connect(this.url, this.mongooseOptions)
      .then(() => {
        log('conectado a MongoDB');
      })
      .catch(err => {
        const retrySeconds = 5;
        log(`Conexión a MongoDB no satisfactoria (reintento #${++this.count} despues ${retrySeconds} segundos):`, err);
        setTimeout(this.connectWithRetry, retrySeconds * 1000);
      });
  };
}
export default new MongooseService();
