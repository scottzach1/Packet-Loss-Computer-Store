import {ShopListing, ShopListingDoc} from "../models/shopListingModel";

/**
 * Creates a new item using the properties provided within the `value` passed from
 * the properties of the `value` parameter. Note: If a given property does not exist
 * on the object within the schema then the property will be ignored.
 *
 * @param value - containing the properties to create the new item.
 */
export const createItem = async (value: any) => {
    // Remove any dangerous values, (this should already be handled by Mongoose regardless).
    value = Object.assign(value, {id: undefined, _id: undefined, __v: undefined});

    // Construct object using values.
    return await new ShopListing({
        ...value,
        createdDate: new Date(),
    }).save();
}

/**
 * Removes an item reference from the `shoplisting` collection.
 *
 * @param item - `ShopListingDoc` reference to remove from MongoDB.
 */
export const removeItem = async (item: ShopListingDoc) => {
    // Extract vales from request body.
    const {id} = item;

    await item.remove();

    return ShopListing.findById(id);
}

/**
 * Updates an item stored within the Mongo DB based off its id, with new values passed
 * from the properties of the `value` parameter. Note: If a given property does not
 * exist on the object within the schema then the property will be ignored.
 *
 * @param item - the `ShopListingDoc` to update.
 * @param value - object containing all of the properties to update the item with.
 */
export const updateItem = async (item: ShopListingDoc, value: any) => {
    if (typeof value !== 'object') return null;

    // Remove any dangerous values, (this should already be handled by Mongoose regardless).
    value = Object.assign(value, {id: undefined, _id: undefined, __v: undefined});

    // Update values of the item (FIXME: this has been deprecated but works fine).
    await item.update({
        ...value,
        updatedDate: new Date(),
    });

    // Search for the updated doc.
    return ShopListing.findById(item.id);
}

/**
 * Gets all `ShopListItem` items stored within the `shoplistings` MongoDB collection.
 */
export const getAllItems = async () => {
    return ShopListing.find();
}

/**
 * Gets the `ShopListItem` with the corresponding itemId.
 *
 * @param itemId - the id reference of the item to find.
 */
export const getItemById = async (itemId: string) => {
    return ShopListing.findById(itemId);
}
