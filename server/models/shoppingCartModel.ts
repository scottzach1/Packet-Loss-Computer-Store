import {ShopListingInterface} from "./shopListingModel";
import * as mongoose from "mongoose";

interface ShoppingCartEntryInterface {
    item: ShopListingInterface[]
    quantity: number,
}

export interface ShoppingCartInterface {
    items: ShoppingCartEntryInterface[],
    totalCost: number,
}

interface ShoppingCartModelDoc extends mongoose.Document, ShoppingCartInterface {
}

interface ShoppingCartModelInterface extends mongoose.Model<ShoppingCartModelDoc> {
    build(attr: ShoppingCartInterface): ShoppingCartModelDoc,
}

const shoppingCartSchema = new mongoose.Schema({
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

shoppingCartSchema.statics.build = (attr: ShoppingCartInterface) => {
    return new ShoppingCart(attr);
}

const ShoppingCart = mongoose.model<ShoppingCartModelDoc, ShoppingCartModelInterface>('ShoppingCart', shoppingCartSchema);

export {ShoppingCart};
