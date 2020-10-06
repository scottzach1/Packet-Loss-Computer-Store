import express from 'express';

const router = express.Router();

router.get('/api/shop/items/add', ((req, res) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

router.get('/api/shop/items/remove', ((req, res) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

router.get('/api/shop/items/update', ((req, res) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

export {router as shopServerRouter};
