import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import passport from "passport";
import './server/controller/db';
import {clientRouter} from "./client/routes";
import {serverRouter} from "./server/routes";

// Initialize configuration
dotenv.config();

// Create App.
const app = express();
const serverPort = process.env.SERVER_PORT || 3000;

// Configurations
app.set('port', serverPort);

// Middlewares
app.use(express.json());
app.use(passport.initialize());

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'client/views'));

// Setup Public Folder
app.use(express.static('./public'));

// Add Custom Routing
app.use('/', clientRouter);
app.use('/api', serverRouter);

// Listen for traffic on NPM port.
app.listen(serverPort, () => {
    console.log(`server is listening on port ${serverPort}`);
});
