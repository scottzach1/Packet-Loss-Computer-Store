import {ShopListingInterface} from "./shopListingModel";
import * as mongoose from "mongoose";

interface ShoppingCartEntryInterface {
    item: ShopListingInterface[]
    quantity: number,
}

export interface ShopCartInterface {
    items: ShoppingCartEntryInterface[],
    totalCost: number,
}

interface ShopCartModelDoc extends mongoose.Document, ShopCartInterface {
}

interface ShopCartModelInterface extends mongoose.Model<ShopCartModelDoc> {
    build(attr: ShopCartInterface): ShopCartModelDoc,
}

const shopCartSchema = new mongoose.Schema({
    items: {
        type: Array,
        required: true,
        default: [],
    },
    totalCost: {
        type: Number,
        required: true,
    },
});

shopCartSchema.statics.build = (attr: ShopCartInterface) => {
    return new ShopCart(attr);
}

const ShopCart = mongoose.model<ShopCartModelDoc, ShopCartModelInterface>('ShoppingCart', shopCartSchema);

export {ShopCart};
