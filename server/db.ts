import mongoose, {ConnectionOptions} from "mongoose";
import config from "./config";

const mongoOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
}

mongoose.connect(config.MONGO_DB.URI, mongoOptions);
console.log(`connecting to '${config.MONGO_DB.URI}'`);

export const database = mongoose.connection;

database.once('open', () => {
  if (process.env.NODE_ENV !== 'testing')
    console.log('connected to database');
});

database.on('error', (err) => {
  if (process.env.NODE_ENV !== 'testing')
    console.error('failed to connect to database', err);
  process.exit();
});

database.once('close', () => {
  if (process.env.NODE_ENV !== 'testing')
    console.log('disconnected from database');
});
