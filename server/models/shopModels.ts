import mongoose from 'mongoose'

interface ShopListingInterface {
    title: string;
    description: string;
}

interface ShopListingModelInterface extends mongoose.Model<ShopListingDoc> {
    build(attr: ShopListingInterface): ShopListingDoc
}

interface ShopListingDoc extends mongoose.Document {
    title: string;
    description: string;
}

const shopListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

shopListingSchema.statics.build = (attr: ShopListingInterface) => {
    return new ShopListing(attr)
}

const ShopListing = mongoose.model<ShopListingDoc, ShopListingModelInterface>('ShopListing', shopListingSchema);

export {ShopListing}
