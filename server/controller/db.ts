import mongoose, {ConnectionOptions} from "mongoose";
import config from "../config";

const mongoOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    user: config.MONGO_DB.USERNAME,
    pass: config.MONGO_DB.PASSWORD,
}

mongoose.connect(config.MONGO_DB.URI, mongoOptions);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('connected to database');
});

connection.on('error', (err) => {
    console.error('failed to connect to database', err);
    process.exit();
});
