import express from 'express';
import {accountServerRouter} from "./accountServerRoutes";
import {authServerRouter} from "./authServerRoutes";
import {cartServerRouter} from "./cartServerRoutes";
import {shopServerRouter} from "./shopServerRoutes";
import {orderServerRouter} from "./ordersServerRoutes";

const router = express.Router();

router.use('/account', accountServerRouter);
router.use('/auth', authServerRouter);
router.use('/cart', cartServerRouter);
router.use('/shop', shopServerRouter);
router.use('/orders', orderServerRouter);

export {router as serverRouter};
