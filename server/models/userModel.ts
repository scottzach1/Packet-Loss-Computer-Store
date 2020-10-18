import {Document, model, Schema, Types} from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserDoc extends Document {
    email: string,
    password?: string,
    comparePassword: (password: string) => Promise<boolean>,
    displayName?: string,
    cartId?: Types.ObjectId,
    orderIds?: Types.ObjectId[],
    admin: boolean,
    resetSeed?: string,
}

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: false,
    },
    displayName: {
        type: String,
        required: false,
    },
    // Foreign Key: ShopCart
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'ShopCart',
        required: false,
    },
    // Foreign Key: ShopOrder
    orderIds: [{
        type: Schema.Types.ObjectId,
        ref: 'ShopOrder',
        required: true,
    }],
    admin: {
        type: Boolean,
        required: false,
        default: false,
    },
    resetSeed: {
        type: String,
        required: false,
    }
});

/**
 * Enforce a pre-action to occur on the document save operation to check for any changes
 * the the password, hashing the new password if applicable. This approach means that at
 * no point does any plaintext password touch the database.
 */
userSchema.pre<UserDoc>('save', async function (next) {
    const user = this;
    user.admin = false;

    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
});

/**
 * Ensure user has a password, before performing hash and compare.
 */
userSchema.methods.comparePassword = async function (password?: string): Promise<boolean> {
    return (this.password) && await bcrypt.compare(password, this.password);
};

const User = model<UserDoc>('User', userSchema);

export {User};
