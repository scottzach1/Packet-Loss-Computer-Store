import express from 'express';

const router = express.Router();

router.get('/login', ((req, res) => {
    return res.send('LOGIN PAGE');
}));

router.get('/signup', ((req, res) => {
    return res.send('SIGNUP PAGE');
}));

router.get('logout', ((req, res) => {
    return res.send('LOGOUT PAGE');
}));

export {router as accountClientRouter};
