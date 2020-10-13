import {ShopCart, ShopCartDoc} from "../models/shopCartModel";
import {User, UserDoc} from "../models/userModel";
import {Request, Response} from "express";
import {Types} from "mongoose";


const createCart = async (user: UserDoc): Promise<ShopCartDoc> => {
    const cart = new ShopCart({
        userId: user._id,
        items: [],
    });
    await cart.save();

    user.cartId = cart._id;
    await user.save();

    return cart;
}

const getCart = async (user: UserDoc): Promise<ShopCartDoc | null> => {
    const {cartId} = user;
    if (!cartId) return await createCart(user);

    const cart = await ShopCart.findById(cartId);
    return (cart) ? cart : await createCart(user);
}

const clearCart = async (cart: ShopCartDoc): Promise<ShopCartDoc> => {
    cart.items = [];
    await cart.save();

    return cart;
}

const addToCart = async (cart: ShopCartDoc, itemId: string, quantity: number): Promise<ShopCartDoc> => {
    if (!quantity) return await removeFromCart(cart, itemId);

    cart.items = cart.items.filter((item) => item.itemId.toString() !== itemId);
    cart.items.push({itemId: new Types.ObjectId(itemId), quantity});
    await cart.save();

    return cart;
}

const removeFromCart = async (cart: ShopCartDoc, itemId: string) => {
    cart.items = cart.items.filter((item) => item.itemId.toString() !== itemId);
    await cart.save();

    return cart;
}

export const getCartHandler = async (req: Request, res: Response) => {
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
}

export const clearCartHandler = async (req: Request, res: Response) => {
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
}

export const addToCartHandler = async (req: Request, res: Response) => {
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
}

export const removeFromCartHandler = async (req: Request, res: Response) => {
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
}
