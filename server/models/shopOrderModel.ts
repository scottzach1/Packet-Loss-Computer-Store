import {ShopCartDoc, ShopCartEntry} from "./shopCartModel";
import {Document, model, Schema, Types} from 'mongoose';

export interface ShopOrderDoc extends ShopCartDoc, Document {
  userId: Types.ObjectId,
  items: ShopCartEntry[],
  orderDate: Date,
}

const shopOrderSchema = new Schema({
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

const ShopOrder = model<ShopOrderDoc>('ShopOrder', shopOrderSchema);

export {ShopOrder};
