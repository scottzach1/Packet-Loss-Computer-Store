import {UserDoc} from "../models/userModel";
import {ShopOrder, ShopOrderDoc} from "../models/shopOrderModel";
import {ShopCartDoc} from "../models/shopCartModel";
import {clearCart} from "./shopCartController";

/**
 * Creates an order for the given user using the provided cart. Note: if the `user._id` and `cart.userId`
 * do not match, then this function will return null.
 *
 * This function will update the `user` with the new `orderId` and will clear the `cart`.
 *
 * @param user - the user to create the order for.
 * @param cart - the cart to create the order from.
 */
export const makeOrder = async (user: UserDoc, cart: ShopCartDoc): Promise<ShopOrderDoc | null> => {
    const {userId, items} = cart;

    // Quick user id check.
    if (!cart.userId.equals(user._id))
        return null;

    // Make order.
    const order = new ShopOrder({
        userId,
        items,
        date: new Date(),
    });
    await order.save();

    // Clear cart.
    await clearCart(cart);

    // Add order to user.
    const {orderIds} = user;
    user.orderIds = (orderIds) ? [...orderIds, order._id] : [order._id];
    await user.save();

    return order;
}

/**
 * Gets all orders for a provided user. Note: this function does not use the orderId's stored within
 * the user, but instead will search through all orders with a matching id. This approach although
 * potentially unexpected, is more secure, more efficient and more elegant to implement (based on
 * Mongoose library implementation).
 *
 * @param user - the user to retrieve all orders for.
 */
export const getOrders = async (user: UserDoc): Promise<ShopOrderDoc[] | null> => {
    const {_id} = user;

    if (!_id) return null;
    if (!user.orderIds) return [];

    return ShopOrder.find({userId: _id});
}
