import express, {Request, Response} from 'express';
import {render} from '../utils';

const router = express.Router();

router.get('/login', [], ((req : Request, res: Response) => {
    render(req, res, 'pages/login', 'Login', {});
}));

router.get('/signup', [], ((req : Request, res: Response) => {
    render(req, res, 'pages/signup', 'Signup', {});
}));

router.get('/logout', [], ((req : Request, res: Response) => {
    render(req, res, 'pages/logout', 'Logout', {});
}));

export {router as accountClientRouter};
