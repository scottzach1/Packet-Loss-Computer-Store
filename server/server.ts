import express from 'express';
import mongoose from 'mongoose';
import {json} from 'body-parser';
import {accountClientRouter} from "../client/routes/accountClientRoutes";
import {shopClientRouter} from "../client/routes/shopClientRoutes";
import {authServerRouter} from "./routes/authServerRoutes";
import {cartServerRouter} from "./routes/cartServerRoutes";
import {shopServerRouter} from "./routes/shopServerRoutes";
import {accountServerRouter} from "./routes/accountServerRoutes";

const app = express();
app.use(json());

app.use(shopClientRouter);
app.use(accountClientRouter);
app.use(accountServerRouter);
app.use(authServerRouter);
app.use(cartServerRouter);
app.use(shopServerRouter)

mongoose.connect('mongodb://localhost:27017/computer-parts-store', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('connected to database');
});

app.listen(3000, () => {
    console.log('server is listening on port 3000');
});
