import User from '../models/userModel';
import {ExtractJwt, Strategy, StrategyOptions} from "passport-jwt";
import config from "../config";

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET
};

const PassportMiddleware = new Strategy(options, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);
        if (user) return done(null, user);
        else return done(null, false);
    } catch (error) {
        console.error('failed to find user', error);
    }
});

export default PassportMiddleware;
