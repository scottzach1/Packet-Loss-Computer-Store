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
    const id = req.params.id
    User.findById(req.user._id).then((user) => {
        const {cart} = user
        const items = cart.items;
        const mycart = new Cart(cart);
        let i;
        for (i in items){
            if(items[i].new_item._id == id){
                const list = mycart.remove(i);
                break;
            }
        }
        user.cart = mycart.getObject();
        user.save();

        return res.send({delete: true, status: 200})
    }).catch((error: any) =>{
        utils.log('error', error);
        return res.send({delete: false, status: 500, error: 'Failed to delete item'})
    });
}));

router.get('/api/shop/items/update', [], ((req: Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

export {router as shopServerRouter};
