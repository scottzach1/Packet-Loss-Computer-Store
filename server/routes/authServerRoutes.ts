import express, {Request, Response} from 'express';

const router = express.Router();

router.get('/login', [], (req : Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
});

router.get('/signup', [], (req : Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
});

router.get('/reset', [], (req : Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
});

export {router as authServerRouter};
