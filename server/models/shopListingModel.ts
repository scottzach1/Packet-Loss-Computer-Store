import mongoose from 'mongoose'

export interface ShopListingInterface {
    title: string,
    description: string,
    category: string,
    brand: string,
    cost: number,
    available: boolean,
    createdDate: Date,
    updateDate: Date,
}

interface ShopListingModelInterface extends mongoose.Model<ShopListingDoc> {
    build(attr: ShopListingInterface): ShopListingDoc,
}

interface ShopListingDoc extends mongoose.Document, ShopListingInterface {
}

const shopListingSchema = new mongoose.Schema({
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

shopListingSchema.statics.build = (attr: ShopListingInterface) => {
    return new ShopListing(attr);
}

const ShopListing = mongoose.model<ShopListingDoc, ShopListingModelInterface>('ShopListing', shopListingSchema);

export {ShopListing};
