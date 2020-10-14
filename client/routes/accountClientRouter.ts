import express, {Request, Response} from "express";
import {render} from "../utils";


const router = express.Router();

router.get('/get', [], (req: Request, res: Response) => {
    render(req, res, 'pages/account', 'Account Details', {});
});

export {router as accountClientRouter};
