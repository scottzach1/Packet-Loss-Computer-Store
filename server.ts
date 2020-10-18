import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import passport from "passport";
import './server/db';
import cors from 'cors';
import {clientRouter} from "./client/routes";
import {serverRouter} from "./server/routes";
import {GoogleOAuth2Middleware, JwtEmailPasswordMiddleware} from "./server/middleware/passportMiddleware";
import timeout from 'connect-timeout';

import './server/emails';

// Initialize configuration
dotenv.config();

// Create App.
const app = express();
const serverPort = process.env.PORT || process.env.SERVER_PORT || 3000;

// Configurations
app.set('port', serverPort);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api/v1/', timeout('10s'));
app.use(passport.initialize());
passport.use(JwtEmailPasswordMiddleware);
passport.use(GoogleOAuth2Middleware);

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'client/views'));

// Setup Public Folder
app.use(express.static('./public'));

// Add Custom Routing
app.use('/', clientRouter);
app.use('/api/v1', serverRouter);

// Listen for traffic on NPM port.
app.listen(serverPort, () => {
  console.log(`server is listening on port ${serverPort}`);
});

export default app;
