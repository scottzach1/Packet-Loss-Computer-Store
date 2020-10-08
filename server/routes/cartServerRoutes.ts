import express, {Request, Response} from 'express';

const router = express.Router();

router.get('/api/cart/add', [], ((req : Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

router.get('/api/cart/remove', [], ((req : Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    const id = req.params.id
    User.findById(req.user._id).then((user) => {
        const {cart} = user
        const items = cart.items;
        const mycart = new Cart(cart);
        let i;
        for (i in items) {
            if (items[i].new_item._id == id) {
                let list = mycart.remove(i);
                break;
            }
        }
        user.cart = mycart.getObject();
        user.save();
        return res.send('Item removed');
   }});

router.get('/api/cart/clear', [], ((req : Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    User.findById(req.user._id).then((output: { cart: { items: never[]; totalCost: number; }; save: () => void; }) => {
        output.cart = {items: [], totalCost: 0};
        output.save();
        return utils.render(req, res, 'cart', 'Cart', {cart: {items: [], totalCost: 0}});
    }).catch((error) => {
        utils.log('error', error);
        return utils.renderError(req, res, 500, 'Error occured clearing cart');
    })
    return res.send('Cart Cleared');
}));

export {router as cartServerRouter};