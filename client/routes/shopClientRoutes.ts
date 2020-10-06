import express, {Request, Response} from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    return res.send('HOME PAGE');
});

router.get('/checkout', [], ((req : Request, res: Response) => {
    return res.send('CHECKOUT PAGE')
}));

export { router as shopClientRouter };
