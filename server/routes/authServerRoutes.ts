import express, {Request, Response} from 'express';
import {loginHandler, signupHandler} from "../controller/userController";

const router = express.Router();


router.get('/login', [], async (req: Request, res: Response) => {
    const {email, password} = req.body;
    // Try handler.
    const response = await loginHandler(email, password);
    const code = (response.success) ? 200 : 400;
    // Notify sender.
    return res.send().status(code).json(response);
});

router.get(`/signup`, [], async (req: Request, res: Response) => {
    const {email, password, passwordConfirmation} = req.body;
    // Try handler.
    const response = await signupHandler(email, password, passwordConfirmation);
    const code = (response.success) ? 201 : 400;
    // Notify sender.
    return res.send().status(code).json(response);
});

router.get('/reset', [], (req: Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('TODO: Needs to be implemented!');
});

export {router as authServerRouter};
