import {ShopCart, ShopCartInterface} from "./shopCartModel";
import {UserInterface} from "./userModel";
import mongoose from "mongoose";

interface ShopOrderInterface {
    cart: ShopCartInterface,
    user: UserInterface,
    orderDate: Date,
}

interface ShopOrderModelDoc extends mongoose.Document, ShopOrderInterface {
}

interface ShopOrderModelInterface extends mongoose.Model<ShopOrderModelDoc> {
    build(attr: ShopOrderInterface): ShopOrderModelDoc,
}

const shopOrderSchema = new mongoose.Schema({
    cart: {
        type: ShopCart,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
});

shopOrderSchema.statics.build = (attr: ShopOrderInterface) => {
    return new ShopOrder(attr);
}

const ShopOrder = mongoose.model<ShopOrderModelDoc, ShopOrderModelInterface>('ShopOrder', shopOrderSchema);

export {ShopOrder};