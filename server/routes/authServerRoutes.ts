import express, {Request, Response} from 'express';
import User, {UserInterface} from "../models/userModel";
import jwt from "jsonwebtoken";
import config from "../config";

const router = express.Router();

interface AuthServerRouteResponse {
    errors: string[],
    success: boolean,
    token?: string,
}

function createToken(user: UserInterface) {
    return jwt.sign({id: user.id, email: user.email}, config.JWT_SECRET, {
        expiresIn: '1h',
    });
}

router.get('/login', [], async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const response: AuthServerRouteResponse = {
        errors: [],
        success: false,
        token: undefined,
    };

    // Missing email or password.
    if (!email) response.errors.push(`Email attribute missing`);
    if (!password) response.errors.push(`Password attribute missing!`);

    if (response.errors.length) {
        return res.send().status(400).json(response);
    }

    // Invalid email.
    const user = await User.findOne({'email': email});
    if (!user) {
        response.errors.push('No user with this email exists!');
        return res.send().status(400).json(response);
    }

    // Wrong password (for email).
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        response.errors.push(`Incorrect email or password!`);
        return res.send().status(400).json(response);
    }

    // Success.
    response.success = true;
    response.token = createToken(user);
    return res.status(200).json(response);
});

router.get(`/signup`, [], async (req: Request, res: Response) => {
    const {email, password, passwordConfirmation} = req.body;

    const response: AuthServerRouteResponse = {
        errors: [],
        success: false,
        token: undefined,
    };

    // Missing email or password.
    if (!email) response.errors.push(`Email attribute missing`);
    if (!password) response.errors.push(`Password attribute missing!`);

    if (response.errors.length) {
        return res.send().status(400).json(response);
    }

    // Passwords miss match.
    if (password !== passwordConfirmation) {
        // TODO: This is probably more appropriate in client.
        response.errors.push(`Passwords don't match!`);
        return res.send().status(400).json(response);
    }

    // Check if user exists.
    const userCheck = await User.findOne({'email': email});
    if (userCheck) {
        response.errors.push(`User with this email already exists!`);
        return res.status(400).json(response);
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
    return res.send(201).json(response);
});

router.get('/reset', [], (req: Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
});

export {router as authServerRouter};
