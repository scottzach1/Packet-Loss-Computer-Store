import express, {Request, Response} from 'express';

const router = express.Router();

router.get('/api/account/get', [], ((req : Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

router.get('/api/account/update', [], ((req : Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

export {router as accountServerRouter};
