import express, {Request, Response} from 'express';
import {render} from '../../server/utils';

const router = express.Router();

router.get('/', (req, res) => {
    render(req, res, 'pages/index', 'Home', {});
});

router.get('/checkout', [], ((req : Request, res: Response) => {
    render(req, res, 'pages/checkout', 'Checkout', {});
    res.render('pages/checkout');
}));

router.get('/about', [], ((req : Request, res: Response) => {
    render(req, res, 'pages/about', 'About us', {});
}));

export { router as shopClientRouter };
