import User, {UserInterface} from "../models/userModel";
import jwt from "jsonwebtoken";
import config from "../config";

/**
 * Interface defining the object structure of a response from this file.
 */
interface AuthResponse {
    errors: string[],
    success: boolean,
    token?: string,
}

/**
 * Creates a JSON Web Token string for the provided users session.
 * @param user - user to create token for.
 */
const createToken = (user: UserInterface) => {
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
const loginHandler = async (email: string, password: string): Promise<AuthResponse> => {
    const response: AuthResponse = {
        errors: [],
        success: false,
        token: undefined,
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
    response.success = true;
    response.token = createToken(user);
    return response;
}

/**
 * Handler function to support user signup authentication.
 *
 * @param email - users provided email.
 * @param password - users provided password.
 * @param passwordConfirmation - (optional) password confirmation.
 * @return AuthResponse containing success / failure and any error messages.
 */
const signupHandler = async (email: string, password: string, passwordConfirmation?: string): Promise<AuthResponse> => {
    const response: AuthResponse = {
        errors: [],
        success: false,
        token: undefined,
    };

    // Missing email or password.
    if (!email) response.errors.push(`Email attribute missing`);
    if (!password) response.errors.push(`Password attribute missing!`);

    if (response.errors.length) {
        return response;
    }

    // Passwords miss match (if param present).
    if (passwordConfirmation && password !== passwordConfirmation) {
        response.errors.push(`Passwords don't match!`);
        return response;
    }

    // Check if user exists.
    const userCheck = await User.findOne({'email': email});
    if (userCheck) {
        response.errors.push(`User with this email already exists!`);
        return response;
    }

    // Create user.
    const userNew = new User({
        'email': email,
        'password': password,
    })
    await userNew.save();

    // Success.
    response.success = true;
    response.token = createToken(userNew);
    return response;
}

export {AuthResponse, loginHandler, signupHandler};
