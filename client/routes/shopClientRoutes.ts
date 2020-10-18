import express, {Request, Response} from 'express';
import {render} from '../utils';

const router = express.Router();

router.get('/', [], (req: Request, res: Response) => {
    render(req, res, 'pages/index', 'Store', {});
});

router.get('/about', [], (req: Request, res: Response) => {
    render(req, res, 'pages/about', 'About us', {});
});

router.get('/add', [], (req: Request, res: Response) => {
    render(req, res, 'pages/addItem', 'About us', {});
});

router.get('/checkout', [], (req: Request, res: Response) => {
    render(req, res, 'pages/checkout', 'Checkout', {});
    res.render('pages/checkout');
});

router.get('/items/search', [], (req: Request, res: Response) => {
    render(req, res, 'pages/searchResults', 'Search', {});
});

router.get('/items/:itemId', [], (req: Request, res: Response) => {
    render(req, res, 'pages/item', 'Item', {});
});

export {router as shopClientRouter};
