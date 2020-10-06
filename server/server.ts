import express from 'express';
import mongoose from 'mongoose';
import {json} from 'body-parser';
import {accountClientRouter} from "../client/routes/accountClientRoutes";
import {shopClientRouter} from "../client/routes/shopClientRoutes";
import {authServerRouter} from "./routes/authServerRoutes";
import {cartServerRouter} from "./routes/cartServerRoutes";
import {shopServerRouter} from "./routes/shopServerRoutes";
import {accountServerRouter} from "./routes/accountServerRoutes";
import dotenv from 'dotenv';

// Initialize configuration
dotenv.config();
const serverPort = process.env.SERVER_PORT;
const mongoPort = process.env.MONGO_PORT;

// Create App.
const app = express();
app.use(json());

app.use(shopClientRouter);
app.use(accountClientRouter);
app.use(accountServerRouter);
app.use(authServerRouter);
app.use(cartServerRouter);
app.use(shopServerRouter)

// Connect to local Mongo DB.
mongoose.connect(`mongodb://localhost:${mongoPort}/computer-parts-store`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('connected to database');
});


// Listen for traffic on NPM port.
app.listen(serverPort, () => {
    console.log(`server is listening on port ${serverPort}`);
});
