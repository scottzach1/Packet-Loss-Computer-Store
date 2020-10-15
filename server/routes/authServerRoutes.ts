import express, {Request, Response} from 'express';
import {
    loginHandler,
    signinWithGoogleHandler,
    signupHandler,
    updatePasswordHandler
} from "../controller/authController";
import passport from "passport";
import {User} from "../models/userModel";

const router = express.Router();

router.post('/login', [], async (req: Request, res: Response) => {
    const {email, password} = req.body;
    // Try handler.
    const response = await loginHandler(email, password);
    const code = (response.success) ? 200 : 400;
    // Notify sender.
    return res.status(code).json(response).send();
});

router.post(`/signup`, [], async (req: Request, res: Response) => {
    const {email, password, displayName} = req.body;
    // Try handler.
    const response = await signupHandler(email, password, displayName);
    const code = (response.success) ? 201 : 400;
    // Notify sender.
    return res.status(code).json(response).send();
});

router.post('/reset', [], (req: Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('TODO: Needs to be implemented!');
});

router.get('/login/google', passport.authenticate('google', {scope: ['email profile']}));

router.get('/login/google/callback', passport.authenticate('google', {failureRedirect: '/api/v1/auth/login'}), async (req: Request, res: Response) => {
    const {user} = req;

    const response = await signinWithGoogleHandler(user);
    const code = (response.success) ? 200 : 400;

    return res.status(code).json(response).send();
});

/**
 *
 */
router.patch('/update/password', [passport.authenticate("jwt", {session: false})], async (req: Request, res: Response) => {
    const {_id}: any = req.user;
    const {password, passwordConfirmation} = req.body;

    // User authenticated, find within MongoDB.
    const user = await User.findById(_id);

    // Update password and get response.
    const resp = await updatePasswordHandler(user, password, passwordConfirmation);
    const code = (resp.success) ? 200 : 400;

    return res.status(code).json(resp).send();
});

export {router as authServerRouter};
