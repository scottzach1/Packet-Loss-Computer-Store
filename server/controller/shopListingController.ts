import {ShopListing} from "../models/shopListingModel";
import {Request, Response} from "express";

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
export const createItemHandler = async (req: Request, res: Response) => {
    // Extract values from request body.
    const {title, description, available, cost, brand, category} = req.body;

    // Save Model within Mongodb.
    try {
        // Construct object using values.
        const shopListing = await new ShopListing({
            title,
            description,
            available,
            cost,
            brand,
            category,
            createdDate: new Date(),
        }).save();

        // Success.
        return res
            .status(201)
            .json({shopListing})
            .send();
    } catch (e) {
        // Failure.
        return res
            .status(400)
            .json({errors: [e]})
            .send();
    }
}

/**
 * Removes an item stored within the Mongo DB based off its id parsed from the `req.body`.
 *
 * Body Parameters:
 * - id (string) the monogodb id of the item.
 *
 * @param req - express request.
 * @param res - express response.
 */
export const removeItemHandler = async (req: Request, res: Response) => {
    // Extract vales from request body.
    const {id} = req.body;

    try {
        const item = await ShopListing.findById(id);

        if (!item) throw "Item could not be found";

        item.remove();

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
}

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
 *
 * @param req - express request.
 * @param res - express response.
 */
export const updateItemHandler = async (req: Request, res: Response) => {
    // Extract values from request body.
    const {id} = req.body;

    try {
        const shopListing = await ShopListing.findById(id);

        if (!shopListing) throw "Item could not be found";

        req.body.id = undefined;

        await shopListing.update({
            ...req.body,
            updatedDate: new Date(),
        });

        const updatedShopListing = await ShopListing.findById(id);

        return res
            .status(200)
            .json({items: updatedShopListing})
            .send();
    } catch (e) {
        return res
            .status(400)
            .json({errors: [e]})
            .send();
    }
}

/**
 * Gets all `ShopListItem` items stored within the Mongo DB based.
 *
 * @param req - express request.
 * @param res - express response.
 */
export const getAllItemsHandler = async (req: Request, res: Response) => {
    try {
        const listings = await ShopListing.find();

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
}

