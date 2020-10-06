import express, {Request, Response} from 'express';
import {ShopListing} from "../models/shopModels";

const router = express.Router();

router.get('/api/shop/items/all', [], (req: Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
});

router.post('/api/shop/items/add', [], async (req: Request, res: Response) => {
    // Extract values from request body.
    const {title, description} = req.body;

    // Construct object using values.
    const shopListing = ShopListing.build({title, description});

    // Save Model within Mongodb.
    await shopListing.save();

    // Notify User of Response.
    console.log('New item added!', shopListing);
    return res.status(201).send(shopListing);
});

router.get('/api/shop/items/remove', [], ((req: Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

router.get('/api/shop/items/update', [], ((req: Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

export {router as shopServerRouter};
