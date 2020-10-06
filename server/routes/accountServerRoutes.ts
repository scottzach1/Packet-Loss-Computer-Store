import express from 'express';

const router = express.Router();

router.get('/api/account/get', ((req, res) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

router.get('/api/account/update', ((req, res) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

export {router as accountServerRouter};
