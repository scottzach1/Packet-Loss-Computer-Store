import express, {Request, Response} from 'express';
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

app.listen(3000, () => {
    console.log('server is listening on port 3000');
});
