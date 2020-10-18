import express, {Request, Response} from 'express';
import {
    checkPasswordComplexity,
    createToken,
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
    const status = response.success ? 200 : 400;

    res.status(status).send(`
                <script>
                    let token = "${response.token}"
                    let displayName = "${response.displayName}"
                    let admin = ${response.admin}
                    let success = ${response.success}
                    
                    if (success) {
                        window.localStorage.setItem("token", token);
                        window.localStorage.setItem("admin", admin);
                        displayName ? window.localStorage.setItem("displayName", displayName) : null;
                    }
                    window.location.href = window.location.origin + "/"
                </script>
            `
    )});

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
    let token = createToken(user);

    // Notify sender
    return res.status(200).json({token}).send()
});

export {router as authServerRouter};
