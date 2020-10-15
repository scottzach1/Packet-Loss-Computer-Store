import {User} from "../models/userModel";
import express, {Request, Response} from 'express';
import passport from "passport";

const router = express.Router();

router.post('/get', [passport.authenticate("jwt", {session: false})], async (req: Request, res: Response) => {
    const {_id}: any = req.user;

    // User authenticated, find within MongoDB.
    const user = await User.findById(_id);
    const code = (user) ? 200 : 400;

    return res.status(code).json(user).send();
});

router.patch('/update', [], (req: Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
});

export {router as accountServerRouter};
