import {User} from "../models/userModel";
import {ExtractJwt, Strategy as JwtStrategy, StrategyOptions as JwtStrategyOptions} from "passport-jwt";
import {Strategy as GoogleStrategy, StrategyOptions as GoogleStrategyOptions} from 'passport-google-oauth20'
import config from "../config";
import passport from "passport";

/**
 * Additional options passed to Passport.js Jwt.
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
const jwtOptions: JwtStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromBodyField('token'),
  secretOrKey: config.JWT_SECRET
};

/**
 * Defines the strategy to use once the JWT token has been verified to find the
 * user details. Here find the User entry from Mongodb and keyed by the ID
 * (from token).
 */
export const JwtEmailPasswordMiddleware = new JwtStrategy(jwtOptions, async (payload, done) => {
  if (config.NODE_ENV !== 'testing') {
    console.log('authenticated token with payload', payload);
  }
  try {
    const user = await User.findById(payload.id);
    if (user) return done(null, user);
    else return done(null, false);
  } catch (error) {
    console.error('failed to find user', error);
  }
});

/**
 * Additional options passed to Passport.js Google OAuth2.
 *
 * Here we both specify our OAuth2 client id and secret (required for verification).
 * We also specify a `callbackURL` to redirect the user to once they have passed
 * authentication from Google's end. The payload will be passed through the URL as
 * query params, but this should be handled by Passport.js Gooogle OAuth2.
 */
const oauth2Options: GoogleStrategyOptions = {
  clientID: config.GOOGLE_OAUTH2.CLIENT_ID,
  clientSecret: config.GOOGLE_OAUTH2.CLIENT_SECRET,
  callbackURL: '/api/v1/auth/login/google/callback',
};

/**
 * Defines a strategy to use to find / create matching user after they have passed OAuth2
 * authentication. Here we use the users name and email from the JSON payload of the
 * OAuth2 profile to create an account if applicable. Note: This does not generate or
 * verify a Jwt token and is only used upon initial authorization of user.
 */
export const GoogleOAuth2Middleware = new GoogleStrategy(oauth2Options, async (accessToken, refreshToken, profile, done) => {
  console.log('authenticated google profile');
  try {
    const {name, email} = profile._json;

    let user = await User.findOne({email});
    if (!user) {
      // Create user.
      user = new User({email, displayName: name, hasPassword: false});
      await user.save();
    }

    return done(undefined, user);
  } catch (error) {
    console.error('failed to login google user', error);
  }
});

/**
 * Default: Serializes the user such that it can be passed through callback.
 */
passport.serializeUser((user, done) => {
  done(null, user);
});

/**
 * Default: Deserializes the user such that it can be used within authentication handlers.
 */
passport.deserializeUser((user, done) => {
  done(null, user);
});
