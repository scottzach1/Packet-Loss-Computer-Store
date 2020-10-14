import express, {Request, Response} from 'express';
import {addToCart, clearCart, getCart, getCartItems, removeFromCart} from "../controller/shopCartController";
import passport from "passport";
import {User} from "../models/userModel";

const router = express.Router();

router.post('/get', [passport.authenticate("jwt", {session: false})], async (req: Request, res: Response) => {
    const {_id}: any = req.user;

    try {
        // User authenticated, find within MongoDB.
        const user = await User.findById(_id);
        if (!user) throw 'Could not find user!';

        // User found, obtain and clear cart.
        const cart = await getCart(user);
        if (!cart) throw 'Failed to find cart for user';

        // Success
        return res
            .status(200)
            .json({cart})
            .send();
    } catch (e) {
        // Failure
        return res
            .status(400)
            .json({errors: [e]})
            .send();
    }
});

router.get('/get/items', [passport.authenticate("jwt", {session: false})], async (req: Request, res: Response) => {
    const {_id}: any = req.user;

    try {
        // User authenticated, find within MongoDB.
        const user = await User.findById(_id);
        if (!user) throw 'Could not find user!';

        // User found, obtain cart.
        const cart = await getCart(user);
        if (!cart) throw 'Failed to obtain cart for user';

        // Get individual items within single object.
        const items = await getCartItems(cart);
        if (!items) throw 'Failed to assemble cart items';

        // Success
        return res
            .status(200)
            .json({items})
            .send()
    } catch (e) {
        // Failure
        return res
            .status(400)
            .json({errors: [e]})
            .send();
    }
});

router.put('/add', [passport.authenticate("jwt", {session: false})], async (req: Request, res: Response) => {
    const {_id}: any = req.user;
    const {itemId, quantity} = req.body;

    try {
        // User authenticated, find within MongoDB.
        const user = await User.findById(_id);
        if (!user) throw 'Could not find user!';

        // User found, obtain cart.
        const cart = await getCart(user);
        if (!cart) throw 'Failed to obtain cart for user';

        // Add item to cart.
        if (!itemId || (typeof quantity !== 'number'))
            throw 'Missing `itemId` and `quantity` arguments.'
        await addToCart(cart, itemId, quantity);

        // Success
        return res
            .status(201)
            .json({cart})
            .send();
    } catch (e) {
        // Failure
        return res
            .status(400)
            .json({errors: [e]})
            .send();
    }
});

router.delete('/remove', [passport.authenticate("jwt", {session: false})], async (req: Request, res: Response) => {
    const {_id}: any = req.user;
    const {itemId} = req.body;

    try {
        // User authenticated, find within MongoDB.
        const user = await User.findById(_id);
        if (!user) throw 'Could not find user!';

        // User found, obtain cart.
        const cart = await getCart(user);
        if (!cart) throw 'Failed to obtain cart for user';

        // Add item to cart.
        if (!itemId) throw 'Missing `itemId` argument.'
        await removeFromCart(cart, itemId);

        // Success
        return res
            .status(200)
            .json({cart})
            .send();
    } catch (e) {
        // Failure
        return res
            .status(400)
            .json({errors: [e]})
            .send();
    }
});

router.delete('/clear', [passport.authenticate("jwt", {session: false})], async (req: Request, res: Response) => {
    const {_id}: any = req.user;

    try {
        // User authenticated, find within MongoDB.
        const user = await User.findById(_id);
        if (!user) throw 'Could not find user!';

        // User found, obtain and clear cart.
        const cart = await getCart(user);
        if (!cart) throw 'Failed to create or clear cart for user';
        await clearCart(cart);


        // Success
        return res
            .status(200)
            .json({cart})
            .send();
    } catch (e) {
        // Failure
        return res
            .status(400)
            .json({errors: [e]})
            .send();
    }
});

export {router as cartServerRouter};
