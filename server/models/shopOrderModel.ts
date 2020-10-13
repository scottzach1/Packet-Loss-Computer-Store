import {ShopCartEntry} from "./shopCartModel";
import mongoose from "mongoose";

interface ShopOrderInterface {
    userId: string,
    items: ShopCartEntry[],
    orderDate: Date,
}

interface ShopOrderModelDoc extends mongoose.Document, ShopOrderInterface {
}

interface ShopOrderModelInterface extends mongoose.Model<ShopOrderModelDoc> {
    build(attr: ShopOrderInterface): ShopOrderModelDoc,
}

const shopOrderSchema = new mongoose.Schema({
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
            },
            quantity: Number,
        }],
        default: [],
        required: true,
    },
    orderDate: {
        type: Date,
        default: new Date(),
        required: true,
    },
});

shopOrderSchema.statics.build = (attr: ShopOrderInterface) => {
    return new ShopOrder(attr);
}

const ShopOrder = mongoose.model<ShopOrderModelDoc, ShopOrderModelInterface>('ShopOrder', shopOrderSchema);

export {ShopOrder};
