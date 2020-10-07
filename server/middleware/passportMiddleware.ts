import User from '../models/userModel';
import {ExtractJwt, Strategy, StrategyOptions} from "passport-jwt";
import config from "../config";

/**
 * Additional options passed to Passport.JS.
 *
 * Here we specify both our secret key (for encode / decoding), as well as
 * to find the user JWT token from within the request body.
 *
 * ```javascript
 * req.body {
 *     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     ...
 * }
 * ```
 */
const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromBodyField('token'),
    secretOrKey: config.JWT_SECRET
};

/**
 * Defines the strategy to use once the JWT token has been verified to find the
 * user details. Here find the User entry from Mongodb and keyed by the ID
 * (from token).
 */
export default new Strategy(options, async (payload, done) => {
    console.log('authenticated token with payload', payload);
    try {
        const user = await User.findById(payload.id);
        if (user) return done(null, user);
        else return done(null, false);
    } catch (error) {
        console.error('failed to find user', error);
    }
});
