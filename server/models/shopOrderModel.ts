import {ShoppingCart, ShoppingCartInterface} from "./shoppingCartModel";
import {UserInterface} from "./userModel";
import * as mongoose from "mongoose";

interface ShopOrderInterface {
    cart: ShoppingCartInterface,
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
        type: ShoppingCart,
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
