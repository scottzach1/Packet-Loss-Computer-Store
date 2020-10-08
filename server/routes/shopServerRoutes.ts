import express from 'express';
import {
    createItemHandler,
    getAllItemsHandler,
    removeItemHandler,
    updateItemHandler
} from "../controller/shopListingController";

const router = express.Router();

router.get('/items/all', [], getAllItemsHandler);

router.post('/items/add', [], createItemHandler);

router.post('/items/remove', [], removeItemHandler);

router.post('/items/update', [], updateItemHandler);

export {router as shopServerRouter};
