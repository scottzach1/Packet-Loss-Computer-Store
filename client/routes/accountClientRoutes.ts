import express, {Request, Response} from 'express';

const router = express.Router();

router.get('/login', [], ((req : Request, res: Response) => {
    return res.send('LOGIN PAGE');
}));

router.get('/signup', [], ((req : Request, res: Response) => {
    return res.send('SIGNUP PAGE');
}));

router.get('logout', [], ((req : Request, res: Response) => {
    return res.send('LOGOUT PAGE');
}));

export {router as accountClientRouter};
