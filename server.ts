import express from 'express';
import mongoose from 'mongoose';
import {json} from 'body-parser';
import {accountClientRouter} from "./client/routes/accountClientRoutes";
import {shopClientRouter} from "./client/routes/shopClientRoutes";
import {authServerRouter} from "./server/routes/authServerRoutes";
import {cartServerRouter} from "./server/routes/cartServerRoutes";
import {shopServerRouter} from "./server/routes/shopServerRoutes";
import {accountServerRouter} from "./server/routes/accountServerRoutes";
import dotenv from 'dotenv';
import path from 'path';

// Initialize configuration
dotenv.config();
const serverPort = process.env.SERVER_PORT;
const mongoPort = process.env.MONGO_PORT;

// Create App.
const app = express();
app.use(json());

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'client/views'));

// Setup Public Folder
app.use(express.static('./public'));

// Add Custom Routing
app.use(shopClientRouter);
app.use(accountClientRouter);
app.use(accountServerRouter);
app.use(authServerRouter);
app.use(cartServerRouter);
app.use(shopServerRouter);

// Connect to local Mongo DB
mongoose.connect(`mongodb://localhost:${mongoPort}/computer-parts-store`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (r) => {
    if (r) console.error('failed to connect to database', r);
    else console.log('connected to database');
});

// Listen for traffic on NPM port.
app.listen(serverPort, () => {
    console.log(`server is listening on port ${serverPort}`);
});
