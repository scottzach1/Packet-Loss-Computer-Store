// import {ShopListing, ShopListingInterface} from "../models/shopListingModel";
//
// interface ListingResponse {
//     data: any,
//     success: boolean,
// }
//
// const createItem = async (listing: ShopListingInterface) => {
//     const resp = {
//         data: {},
//         success: true,
//     }
//
//     const newListing = new ShopListing(listing).save();
//
//     if (!newListing) {
//         resp.success = false;
//         return resp;
//     } else {
//         resp.data = newListing;
//         return resp;
//     }
// }
