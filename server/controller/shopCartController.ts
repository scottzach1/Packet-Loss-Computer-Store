import {ShopCart, ShopCartDoc} from "../models/shopCartModel";
import {UserDoc} from "../models/userModel";
import {Types} from "mongoose";
import {ShopListing, ShopListingDoc} from "../models/shopListingModel";

/**
 * Creates a new cart and associates it with the new `UserDoc`.
 *
 * @param user - the user document to create and associate cart with.
 */
export const createCart = async (user: UserDoc): Promise<ShopCartDoc> => {
    const cart = new ShopCart({
        userId: user._id,
        items: [],
    });
    await cart.save();

    user.cartId = cart._id;
    await user.save();

    return cart;
}

/**
 * Gets the `ShopCartDoc` associated with the user. If none exists, one will be created.
 *
 * @param user - the user to get / create `ShopCartDoc` for.
 */
export const getCart = async (user: UserDoc): Promise<ShopCartDoc | null> => {
    const {cartId} = user;
    if (!cartId) return await createCart(user);

    const cart = await ShopCart.findById(cartId);
    return (cart) ? cart : await createCart(user);
}

/**
 * Gets all items that are referenced within the provided cart. This function will return
 * a fancy view where we see a list of hybrid items containing both the full doc for the
 * list item as well as the corresponding quantity.
 *
 * @param cart - the cart to assemble a list of items from.
 */
export const getCartItems = async (cart: ShopCartDoc): Promise<any[]> => {
    // Make requests for every item (will result in a list of 'promissible' objects).
    const promises: any[] = cart.items.map((entry) => ShopListing.findById(entry.itemId));
    // Await all promises, then filter out null entries (more verbose, but more efficient too).
    const items = (await Promise.all(promises)).filter((doc: ShopListingDoc | null) => doc);
    // Merge with item id's.
    console.log(cart);
    return items.map((item: ShopListingDoc, index: number) => {
            return {
                item, quantity: cart.items[index].quantity
            }
        }
    );
}

/**
 * Clears the provided `ShopCartDoc`.
 *
 * @param cart - the cart to clear.
 */
export const clearCart = async (cart: ShopCartDoc): Promise<ShopCartDoc> => {
    cart.items = [];
    await cart.save();

    return cart;
}

/**
 * Adds the following `itemId` and `quantity` to the provided cart. If mappings already exist,
 * all will be wiped and a new entry will be added.
 *
 * @param cart - the cart to add the entry to.
 * @param itemId - the itemId of the `ShopListingDoc` document.
 * @param quantity - the quantity of the item to save.
 */
export const addToCart = async (cart: ShopCartDoc, itemId: string, quantity: number): Promise<ShopCartDoc> => {
    if (!quantity) return await removeFromCart(cart, itemId);
    const objectId = new Types.ObjectId(itemId)

    cart.items = cart.items.filter((item) => !objectId.equals(item.itemId));
    cart.items.push({itemId: objectId, quantity});
    await cart.save();

    return cart;
}

/**
 * Removes the following `itemId` from the entire `ShopCartDoc`.
 *
 * @param cart - the cart to remove the item from.
 * @param itemId - the itemId of the `ShopListingDoc` to be removed.
 */
export const removeFromCart = async (cart: ShopCartDoc, itemId: string) => {
    const objectId = new Types.ObjectId(itemId)
    cart.items = cart.items.filter((item) => !objectId.equals(item.itemId));
    await cart.save();

    return cart;
}
