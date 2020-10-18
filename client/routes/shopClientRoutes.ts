import express, {Request, Response} from 'express';
import {render} from '../utils';

const router = express.Router();

router.get('/', [], (req: Request, res: Response) => {
    render(req, res, 'pages/index', 'Store', {});
});

router.get('/checkout', [], (req: Request, res: Response) => {
    render(req, res, 'pages/checkout', 'Checkout', {});
    res.render('pages/checkout');
});

router.get('/about', [], (req: Request, res: Response) => {
    render(req, res, 'pages/about', 'About us', {});
});

router.get('/items/:itemId', [], (req: Request, res: Response) => {
    render(req, res, 'pages/item', 'About us', {});
});

router.get('/add', [], (req: Request, res: Response) => {
    render(req, res, 'pages/addItem', 'About us', {});
});

export {router as shopClientRouter};
