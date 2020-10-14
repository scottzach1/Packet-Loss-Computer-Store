import express, {Request, Response} from 'express';
import {loginHandler, signupHandler} from "../controller/authController";

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

export {router as authServerRouter};
