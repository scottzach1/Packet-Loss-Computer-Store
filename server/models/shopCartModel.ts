import {ShopListing} from "./shopListingModel";
import mongoose from "mongoose";

export interface ShopCartEntry {
    itemId: string,
    quantity: number,
}

export interface ShopCartInterface {
    userId: string,
    items: ShopCartEntry[],
}

interface ShopCartModelDoc extends mongoose.Document, ShopCartInterface {
}

interface ShopCartModelInterface extends mongoose.Model<ShopCartModelDoc> {
    build(attr: ShopCartInterface): ShopCartModelDoc,
}

const shopCartSchema = new mongoose.Schema({
    // Foreign Key: User
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: {
        type: [{
            // Foreign Key: ShopListing
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ShopListing',
                required: true,
            },
            quantity: Number,
        }],
        default: [],
        required: true,
    },
});

shopCartSchema.statics.build = (attr: ShopCartInterface) => {
    return new ShopCart(attr);
}

const ShopCart = mongoose.model<ShopCartModelDoc, ShopCartModelInterface>('ShopCart', shopCartSchema);

export {ShopCart};
