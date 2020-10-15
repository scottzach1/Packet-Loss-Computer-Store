import mongoose, {ConnectionOptions} from "mongoose";
import config from "./config";

const mongoOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}

mongoose.connect(config.MONGO_DB.URI, mongoOptions);

const connection = mongoose.connection;

connection.once('open', () => {
    if (config.MONGO_DB.DEBUG) console.log('connected to database');
});

connection.on('error', (err) => {
    if (config.MONGO_DB.DEBUG) console.error('failed to connect to database', err);
    process.exit();
});

connection.once('close', () => {
    if (config.MONGO_DB.DEBUG) console.log('disconnected from database');
});
