import {Document, model, Schema} from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserInterface extends Document {
    email: string,
    password: string,
    comparePassword: (passport: string) => Promise<boolean>,
    displayName?: string,
    cartId?: string,
    orderIds?: string[],
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
        required: true,
    },
    displayName: {
        type: String,
        required: false,
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'ShopCart',
        required: false,
    },
    orderIds: [{
        type: Schema.Types.ObjectId,
        ref: 'ShopOrder',
        required: true,
    }],
});

userSchema.pre<UserInterface>('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export default model<UserInterface>('User', userSchema);
