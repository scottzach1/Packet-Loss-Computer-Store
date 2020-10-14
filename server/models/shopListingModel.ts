import {Document, model, Schema} from 'mongoose'

export interface ShopListingDoc extends Document {
    title: string,
    description: string,
    category: string,
    brand: string,
    cost: number,
    available: boolean,
    createdDate: Date,
    updateDate?: Date,
}

const shopListingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: false,
    },
    brand: {
        type: String,
        required: false,
    },
    cost: {
        type: Number,
        required: true,
    },
    available: {
        type: Boolean,
        required: true,
        default: true,
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        required: false,
        default: Date.now,
    },
});

const ShopListing = model<ShopListingDoc>('ShopListing', shopListingSchema);

export {ShopListing};
