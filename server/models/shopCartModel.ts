import {ShopListing} from "./shopListingModel";
import {Document, model, Schema, Types} from "mongoose";

export interface ShopCartEntry {
    itemId: Types.ObjectId,
    quantity: number,
}

export interface ShopCartDoc extends Document {
    userId: Types.ObjectId,
    items: ShopCartEntry[],
}

const shopCartSchema = new Schema({
    // Foreign Key: User
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: {
        type: [{
            // Foreign Key: ShopListing
            itemId: {
                type: Schema.Types.ObjectId,
                ref: 'ShopListing',
                required: true,
            },
            quantity: Number,
        }],
        default: [],
        required: true,
    },
});

const ShopCart = model<ShopCartDoc>('ShopCart', shopCartSchema);

export {ShopCart};
