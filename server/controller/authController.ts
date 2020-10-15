import {User, UserDoc} from "../models/userModel";
import jwt from "jsonwebtoken";
import config from "../config";

/**
 * Interface defining the object structure of a response from this file.
 */
export interface AuthResponse {
    errors: string[],
    success: boolean,
    token?: string,
    displayName?: string,
    email?: string,
    admin?: boolean,
}

/**
 * Creates a JSON Web Token string for the provided users session.
 * @param user - user to create token for.
 */
const createToken = (user: UserDoc) => {
    return jwt.sign({id: user.id, email: user.email}, config.JWT_SECRET, {
        expiresIn: '1h',
    });
}

/**
 * Handler function to support user login authentication.
 *
 * @param email - users provided email.
 * @param password - users provided password.
 * @return AuthResponse containing success / failure and any error messages.
 */
export const loginHandler = async (email: string, password: string): Promise<AuthResponse> => {
    const response: AuthResponse = {
        errors: [],
        success: false,
    };

    // Missing email or password.
    if (!email) response.errors.push(`Email attribute missing`);
    if (!password) response.errors.push(`Password attribute missing!`);

    if (response.errors.length) {
        return response;
    }

    // Invalid email.
    const user = await User.findOne({'email': email});
    if (!user) {
        response.errors.push('No user with this email exists!');
        return response;
    }

    // Wrong password (for email).
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        response.errors.push(`Incorrect email or password!`);
        return response;
    }

    // Success.
    response.displayName = user.displayName;
    response.email = user.email;
    response.admin = user.admin;
    response.success = true;
    response.token = createToken(user);
    return response;
}

/**
 * Handler function to support user signup authentication.
 *
 * @param email - users provided email.
 * @param password - users provided password.
 * @param displayName - (optional) password confirmation.
 * @return AuthResponse containing success / failure and any error messages.
 */
export const signupHandler = async (email: string, password: string, displayName?: string): Promise<AuthResponse> => {
    const response: AuthResponse = {
        errors: [],
        success: false,
    };

    // Missing email or password.
    if (!email) response.errors.push(`Email attribute missing`);
    if (!password) response.errors.push(`Password attribute missing!`);

    if (response.errors.length) {
        return response;
    }

    // Check if user exists.
    const userCheck = await User.findOne({'email': email});
    if (userCheck) {
        response.errors.push(`User with this email already exists!`);
        return response;
    }

    // Create user.
    const userNew = new User({email, password, displayName});
    await userNew.save();

    // Success.
    response.displayName = userNew.displayName;
    response.email = userNew.email;
    response.success = true;
    response.admin = userNew.admin;
    response.token = createToken(userNew);
    return response;
}

/**
 * Handler function to create user Jwt token after OAuth2 authentication.
 *
 * @param user - the user to create account for. Post middleware this should be a `UserDoc` encapsulated within `Express.User`.
 */
export const signinWithGoogleHandler = async (user: Express.User | UserDoc | any): Promise<AuthResponse> => {
    const response: AuthResponse = {
        errors: [],
        success: false,
    };

    if (!(user && user.id && user.email)) {
        response.errors.push('no valid user could be found for the request.');
        return response;
    }

    response.token = createToken(user);
    response.success = true;

    return response;
};
