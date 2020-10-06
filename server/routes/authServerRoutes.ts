import express from 'express';

const router = express.Router();

router.get('/api/auth/login', ((req, res) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

router.get('/api/auth/signup', ((req, res) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

router.get('/api/auth/reset', ((req, res) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

export {router as authServerRouter};
