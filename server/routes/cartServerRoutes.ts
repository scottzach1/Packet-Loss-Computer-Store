import express from 'express';
import {
    addToCartHandler,
    clearCartHandler,
    getCartHandler,
    removeFromCartHandler
} from "../controller/shopCartController";
import passport from "passport";

const router = express.Router();

router.get('/get',  [passport.authenticate("jwt", {session: false})], getCartHandler);

router.get('/add', [passport.authenticate("jwt", {session: false})], addToCartHandler);

router.get('/remove', [passport.authenticate("jwt", {session: false})], removeFromCartHandler);

router.get('/clear', [passport.authenticate("jwt", {session: false})], clearCartHandler);

export {router as cartServerRouter};
