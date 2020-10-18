import mongoose, {ConnectionOptions} from "mongoose";
import config from "./config";

const mongoOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}

mongoose.connect(config.MONGO_DB.URI, mongoOptions);
console.log(`connecting to '${config.MONGO_DB.URI}'`);

const connection = mongoose.connection;

connection.once('open', () => {
    if (process.env.NODE_ENV !== 'testing')
        console.log('connected to database');
});

connection.on('error', (err) => {
    if (process.env.NODE_ENV !== 'testing')
        console.error('failed to connect to database', err);
    process.exit();
});

connection.once('close', () => {
    if (process.env.NODE_ENV !== 'testing')
        console.log('disconnected from database');
});
