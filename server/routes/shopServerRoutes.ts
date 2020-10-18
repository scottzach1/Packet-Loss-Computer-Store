import express, {Request, Response} from 'express';
import {
    createItem,
    getAllItems,
    getItemById,
    removeItem,
    searchItemByString,
    updateItem
} from "../controller/shopListingController";
import {ShopListing, ShopListingDoc} from "../models/shopListingModel";
import passport from "passport";

const router = express.Router();

/**
 * Gets all `ShopListItem`'s stored within MongoDB.
 */
router.get('/items/all', [], async (req: Request, res: Response) => {
    try {
        const listings = await getAllItems();
        if (!listings) throw 'Failed to get all items';

        return res
            .status(200)
            .json({items: listings})
            .send();
    } catch (e) {
        return res
            .status(400)
            .json({errors: (Array.isArray(e)) ? e : [e]})
            .send();
    }
});

/**
 * Searches the entire collection for any items that match a given string. The matching
 * results are then returned within an array sorted by their `title`'s alphabetically.
 *
 * Query Params
 * - q (string) the string query to run over all items in MongoDB collection.
 *
 * @param req - express request.
 * @param res - express response.
 */
router.get('/items/search', [], async (req: Request, res: Response) => {
    const {q}: any = req.query;

    try {
        if (!q) throw 'Was expecting string query parameter `q`: `/api/v1/items/search?q=amd`'

        const items = await searchItemByString(q);
        if (!items) throw 'Failed to search for query';

        return res
            .status(200)
            .json({items})
            .send();
    } catch (e) {
        return res
            .status(400)
            .json({errors: (Array.isArray(e)) ? e : [e]})
            .send();
    }
});

/**
 * Gets a `ShopListItem` from MongoDB based off the provided id.
 *
 * Request Parameters:
 * - itemdId (string) the id of the item.
 */
router.get('/items/:itemId', [], async (req: Request, res: Response) => {
    const itemId = req.params.itemId;

    try {
        if (!itemId) throw 'ItemId was expected: `/api/v1/items/5f7eb5bfaa2eeede1d640202`'

        const item = await getItemById(itemId).catch(extractErrorsAndThrow);
        if (!item) throw 'No item could be found with that particular id';

        return res
            .status(200)
            .json({item})
            .send();
    } catch (e) {
        return res
            .status(400)
            .json({errors: (Array.isArray(e)) ? e : [e]})
            .send();
    }
});

/**
 * Creates a new item stored within the Mongo DB from values within the `req.body`.
 *
 * Body Parameters:
 * - title (string) title of the listing.
 * - description (string) description of the listing.
 * - available (boolean) the availability status of the listing.
 * - cost (number) the prices of the listing.
 * - brand (string) the brand of the listing.
 * - category (string) the category of the listing.
 *
 * @param req - express request.
 * @param res - express response.
 */
router.post('/items/add', [passport.authenticate("jwt", {session: false})], async (req: Request, res: Response) => {
    const {body, user}: any = req;

    try {
        if (!(user?.admin)) throw 'Insufficient permissions to perform this action.';

        // Save Model within Mongodb.
        let item: null | ShopListingDoc;
        item = await createItem(body).catch(extractErrorsAndThrow);
        if (!item) throw 'Failed to create new item';

        // Success.
        return res
            .status(201)
            .json({item})
            .send();
    } catch (e) {
        // Failure.
        return res
            .status(400)
            .json({errors: (Array.isArray(e)) ? e : [e]})
            .send();
    }
});

/**
 * Removes an item stored within the Mongo DB based off its id parsed from the `req.body`.
 *
 * Body Parameters:
 * - id (string) the monogodb id of the item.
 *
 * @param req - express request.
 * @param res - express response.
 */
router.delete('/items/remove', [passport.authenticate("jwt", {session: false})], async (req: Request, res: Response) => {
    // Extract vales from request body.
    const {body, user}: any = req;

    try {
        if (!(user?.admin)) throw 'Insufficient permissions to perform this action.';

        let item = await getItemById(body.id).catch(extractErrorsAndThrow);
        if (!item) throw 'Item could not be found';

        item = await removeItem(item).catch(extractErrorsAndThrow);
        if (item) throw 'Item could not be removed';

        return res
            .status(200)
            .json({response: 'Item Removed Successfully'})
            .send();
    } catch (e) {
        return res
            .status(400)
            .json({errors: (Array.isArray(e)) ? e : [e]})
            .send();
    }
});

/**
 * Updates an item stored within the Mongo DB based off its id, with new values passed from `req.body`.
 *
 * Body Parameters:
 * - id (string) the monogodb id of the item.
 * - title? (string) title of the listing.
 * - description? (string) description of the listing.
 * - available? (boolean) the availability status of the listing.
 * - cost? (number) the prices of the listing.
 * - brand? (string) the brand of the listing.
 * - category? (string) the category of the listing.
 * ... any other properties relevant.
 *
 * @param req - express request.
 * @param res - express response.
 */
router.patch('/items/update', [passport.authenticate("jwt", {session: false})], async (req: Request, res: Response) => {
    // Extract values from request body.
    const {user, body}: any = req;

    try {
        if (!(user?.admin)) throw 'Insufficient permissions to perform this action.';

        let shopListing = await ShopListing.findById(body.id);

        if (!shopListing) throw 'Item could not be found';

        shopListing = await updateItem(shopListing, req.body).catch(extractErrorsAndThrow);
        if (!shopListing) throw 'Failed to update item';

        return res
            .status(200)
            .json({items: shopListing})
            .send();
    } catch (e) {
        return res
            .status(400)
            .json({errors: (Array.isArray(e)) ? e : [e]})
            .send();
    }
});

/**
 * A small helper function to extract deeply nested errors from mongoose into a usable
 * error string, or array of error strings. This function will ALWAYS throw an exception.
 *
 * @param doc - the potentially erroneous document.
 */
const extractErrorsAndThrow = (doc: any): never => {
    if (doc.errors)
        throw Object.keys(doc.errors).map((i: any) => doc.errors[i].message);

    if (doc.message)
        throw (doc.message);

    throw 'Failed to perform action.';
}

export {router as shopServerRouter};
