import express, {Request, Response} from 'express';
import {createItem, getAllItems, getItemById, removeItem, updateItem} from "../controller/shopListingController";
import {ShopListing} from "../models/shopListingModel";

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
            .json({item: listings})
            .send();
    } catch (e) {
        return res
            .status(400)
            .json({errors: [e]})
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
router.post('/items/add', [], async (req: Request, res: Response) => {
    const {body} = req;

    try {
        // Save Model within Mongodb.
        const item = await createItem(body);
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
            .json({errors: [e]})
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
router.post('/items/remove', [], async (req: Request, res: Response) => {
    // Extract vales from request body.
    const {id} = req.body;

    try {
        let item = await getItemById(id);
        if (!item) throw 'Item could not be found';

        item = await removeItem(item);
        if (item) throw 'Item could not be removed';

        return res
            .status(200)
            .json({response: 'Item Removed Successfully'})
            .send();
    } catch (e) {
        return res
            .status(400)
            .json({errors: [e]})
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
router.post('/items/update', [], async (req: Request, res: Response) => {
    // Extract values from request body.
    const {id} = req.body;

    try {
        let shopListing = await ShopListing.findById(id);

        if (!shopListing) throw 'Item could not be found';

        shopListing = await updateItem(shopListing, req.body);

        if (!shopListing) throw 'Failed to update item';

        return res
            .status(200)
            .json({items: shopListing})
            .send();
    } catch (e) {
        return res
            .status(400)
            .json({errors: [e]})
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

        const item = await getItemById(itemId);

        if (!item) throw 'No item could be found with that particular id';

        return res
            .status(200)
            .json({item})
            .send();
    } catch (e) {
        return res
            .status(400)
            .json({errors: [e]})
            .send();
    }
});

export {router as shopServerRouter};
