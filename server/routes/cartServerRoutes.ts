import express from 'express';

const router = express.Router();

router.get('/api/cart/add', ((req, res) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

router.get('/api/cart/remove', ((req, res) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

router.get('/api/cart/clear', ((req, res) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

export {router as cartServerRouter};
