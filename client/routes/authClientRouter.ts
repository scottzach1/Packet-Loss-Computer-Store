import express, {Request, Response} from 'express';
import {render} from '../utils';

const router = express.Router();

router.get('/login', [], ((req : Request, res: Response) => {
    render(req, res, 'pages/login', 'Login', {...req.body});
}));

router.get('/auto', [], ((req : Request, res: Response) => {
    render(req, res, 'pages/autoLogin', 'Auto Login', {...req.body});
}));

router.get('/signup', [], ((req : Request, res: Response) => {
    render(req, res, 'pages/signup', 'Signup', {});
}));

router.get('/forgot', [], ((req : Request, res: Response) => {
    render(req, res, 'pages/forgotPassword', 'Forgot', {});
}));

router.get('/reset', [], ((req : Request, res: Response) => {
    const {seed} = req.query;
    render(req, res, 'pages/passwordReset', 'Reset', {seed});
}));

router.get('/logout', [], ((req : Request, res: Response) => {
    render(req, res, 'pages/logout', 'Logout', {});
}));

router.get('/inactive', [], ((req : Request, res: Response) => {
    render(req, res, 'pages/inactivity', 'Logout Inactive', {});
}));

export {router as authClientRouter};
