import express, {Request, Response} from 'express';
import {ShopListing} from "../models/shopListingModel";

const router = express.Router();

router.get('/items/all', [], (req: Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
});

router.post('/items/add', [], async (req: Request, res: Response) => {
    // // Extract values from request body.
    const {title, description, available, cost, brand, category} = req.body;

    // Save Model within Mongodb.
    try {
        // Construct object using values.
        const shopListing = await ShopListing.build({
            title,
            description,
            available,
            cost,
            brand,
            category,
            createdDate: new Date(),
        }).save();

        return res
            .status(201)
            .json({shopListing})
            .send();
    } catch (e) {
        return res
            .status(400)
            .json(e)
            .send();
    }
});

router.get('/items/remove', [], (req: Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
});

router.get('/items/update', [], (req: Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
});

export {router as shopServerRouter};
