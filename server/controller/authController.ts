import {User, UserDoc} from "../models/userModel";
import jwt from "jsonwebtoken";
import config from "../config";
// @ts-ignore - valid library, no type definitions available anywhere.
import passwordStrength from 'check-password-strength';

/**
 * Interface defining the object structure of a response from this file.
 */
interface AuthResponse {
    errors: string[],
    success: boolean,
    token?: string,
    displayName?: string,
    email?: string,
    admin?: boolean,
    complexity?: 'weak' | 'medium' | 'strong',
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
const loginHandler = async (email: string, password: string): Promise<AuthResponse> => {
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
const signupHandler = async (email: string, password: string, displayName?: string): Promise<AuthResponse> => {
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

    const {errors, complexity} = checkPasswordComplexity(password);
    response.errors.concat(errors);
    response.complexity = complexity;

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
    const userNew = new User({
        'email': email,
        'password': password,
        'displayName': displayName,
    })
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
 * Checks the current password for complexity, returning any errors within the AuthResponse.
 *
 * @param password - the password to check.
 */
export const checkPasswordComplexity = (password: string): AuthResponse => {
    const response: AuthResponse = {
        errors: [],
        success: false,
    };

    // Check password complexity - check details here:
    // <https://www.npmjs.com/package/check-password-strength>
    const strength = passwordStrength(password);

    // @ts-ignore - TypeScript can't verify `strength.id` as a number [0, 2].
    response.complexity = ['weak', 'medium', 'strong'][strength.id];

    // Password length.
    if (strength.length < 6) {
        response.errors.push(`Password doesn't meet the minimum password length! (${strength.length}/${6})`);
    }

    // Password contents.
    ['lowercase', 'uppercase', 'symbol', 'number']
        .filter((req: string) => !strength.contains.find((entry: { message: string }) => req === entry.message))
        .forEach((hit: string) => response.errors.push(`Password needs at least one ${hit}`));

    // Password total complexity.
    if (strength.id < 1) response.errors.push(`Password must be of minimum '2' complexity`);

    response.success = response.errors.length === 0;
    return response;
}

export {AuthResponse, loginHandler, signupHandler};
