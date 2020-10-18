import {ShopListing, ShopListingDoc} from "../models/shopListingModel";

/**
 * Creates a new item using the properties provided within the `value` passed from
 * the properties of the `value` parameter. Note: If a given property does not exist
 * on the object within the schema then the property will be ignored.
 *
 * @param value - containing the properties to create the new item.
 */
export const createItem = async (value: any) => {
  if (typeof value !== 'object') return null;

  // Remove any dangerous values, (this should already be handled by Mongoose regardless).
  ['id', '_id', '__V'].forEach((id) => delete value[id]);

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
  ['id', '_id', '__V'].forEach((id) => delete value[id]);

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

/**
 * Searches the entire collection for any items that match a given string. The matching
 * results are then returned within an array sorted by their `title`'s alphabetically.
 *
 * @param query - the query to run over all items.
 */
export const searchItemByString = async (query: string) => {
  const allItems = await getAllItems();
  const q = query.toLocaleLowerCase();

  return allItems
    // First we string filter based off any `string` properties of item.
    .filter((item: ShopListingDoc) => {
      // Extract the underlying doc. (This took a while to debug - it is hidden).
      const {_doc}: any = item;

      for (const key in _doc) {
        // Standard safety type checking.
        if (!_doc.hasOwnProperty(key) || typeof _doc[key] !== 'string')
          continue;

        // Lowercase Compare.
        const v = _doc[key].toLocaleLowerCase();

        // Hit
        if (v.includes(q))
          return true;
      }
      // No Hit.
      return false;
    })
    // Second we order by product titles alphabetically.
    .sort((a, b) => a.title.localeCompare(b.title));
}
