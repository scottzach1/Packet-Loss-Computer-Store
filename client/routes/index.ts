import express, {Request, Response} from 'express';
import {render} from '../utils';
import {authClientRouter} from "./authClientRouter";
import {shopClientRouter} from "./shopClientRoutes";
import {accountClientRouter} from "./accountClientRouter";

const router = express.Router();

router.use('/account', accountClientRouter);
router.use('/auth', authClientRouter);
router.use('/shop', shopClientRouter);

router.get('/', [], (req: Request, res: Response) => {
  render(req, res, 'pages/index', 'Store', {});
});

export {router as clientRouter};
