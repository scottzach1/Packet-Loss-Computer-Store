import express, {Request, Response} from 'express';
import {render} from '../utils';
import {authClientRouter} from "./authClientRouter";
import {shopClientRouter} from "./shopClientRoutes";

const router = express.Router();

router.use('/auth', authClientRouter);
router.use('/shop', shopClientRouter);

router.get('/', [], (req : Request, res: Response) => {
    render(req, res, 'pages/index', 'Home', {});
});

export {router as clientRouter};
