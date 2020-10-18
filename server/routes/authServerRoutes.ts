import express, {Request, Response} from 'express';
import {
    checkPasswordComplexity,
    createToken,
    generateResetLinkHandler,
    loginUser,
    redeemResetLinkHandler,
    signinWithGoogleHandler,
    signupUser,
    updatePasswordHandler
} from "../controller/authController";
import passport from "passport";
import {User} from "../models/userModel";

const router = express.Router();

router.post('/login', [], async (req: Request, res: Response) => {
    const {email, password} = req.body;
    // Try handler.
    const response = await loginUser(email, password);
    const code = (response.success) ? 200 : 400;
    // Notify sender.
    return res.status(code).json(response).send();
});

router.post('/signup', [], async (req: Request, res: Response) => {
    const {email, password, displayName} = req.body;
    // Try handler.
    const response = await signupUser(email, password, displayName);
    const code = (response.success) ? 201 : 400;
    // Notify sender.
    return res.status(code).json(response).send();
});

router.post('/reset', [], async (req: Request, res: Response) => {
    const {email} = req.body;
    const user = await User.findOne({email});

    if (user) {
        await generateResetLinkHandler(user);
    }

    return res
        .status(200)
        .json({'message': 'If the email address matches a given account, then you will receive an email within the next 5 minutes.'})
        .send();
});

router.post('/reset/redeem', [], async (req: Request, res: Response) => {
    const {seed, password} = req.body;
    const resp = await redeemResetLinkHandler(seed, password);
    return res.status(200).json(resp).send();
});

router.get('/login/google', passport.authenticate('google', {scope: ['email profile']}));

router.get('/login/google/callback', passport.authenticate('google', {failureRedirect: '/api/v1/auth/login'}), async (req: Request, res: Response) => {
    const {user} = req;

    const resp = await signinWithGoogleHandler(user);
    const status = (resp.success) ? 200 : 400;

    res.status(status).send(`
        <script>
            let token = "${resp.token}"
            let displayName = "${resp.displayName}"
            let admin = ${resp.admin}
            let success = ${resp.success}

            if (success) {
                window.localStorage.setItem("token", token);
                window.localStorage.setItem("admin", admin);
                displayName ? window.localStorage.setItem("displayName", displayName) : null;
            }
            window.location.href = window.location.origin + "/"
        </script>
    `);
});

router.patch('/update/password', [passport.authenticate("jwt", {session: false})], async (req: Request, res: Response) => {
    const {_id}: any = req.user;
    const {password} = req.body;

    // User authenticated, find within MongoDB.
    const user = await User.findById(_id);

    // Update password and get response.
    const resp = await updatePasswordHandler(user, password);
    const code = (resp.success) ? 200 : 400;

    return res.status(code).json(resp).send();
});

router.post('/complexity', [], (req: Request, res: Response) => {
    const {password} = req.body;
    // Check password.
    const response = checkPasswordComplexity(password);
    // Notify sender.
    return res.status(200).json(response).send();
});


router.post('/renew', [passport.authenticate("jwt", {session: false})], (req: Request, res: Response) => {
    const {user}: any = req;

    if (!user) {
        return res.status(400).json({errors: ["Invalid User for Token Renewal"]}).send()
    }

    // Renew user token
    const token = createToken(user);

    // Notify sender
    return res.status(200).json({token}).send()
});

export {router as authServerRouter};
