import express, {Request, Response} from 'express';

const router = express.Router();

router.get('/api/auth/login', [], ((req : Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

router.get('/api/auth/signup', [], ((req : Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

router.get('/api/auth/reset', [], ((req : Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

export {router as authServerRouter};
