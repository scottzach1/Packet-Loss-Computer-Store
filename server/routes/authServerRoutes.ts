import express, {Request, Response} from 'express';

const router = express.Router();

router.get('/api/auth/login', [], ((req : Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    if(req.user) {
        return res.redirect('/');
    }
    return utils.render(req, res, 'login', 'Login', {})
}));

router.get('/api/auth/signup', [], ((req : Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    if(req.user) {
        return res.redirect('/');
    }
    return utils.render(req, res, 'signup', 'Sign Up', {});
}));

router.get('/api/auth/reset', [], ((req : Request, res: Response) => {
    // TODO: This will need to be implemented in much more depth.
    return res.send('SOME ACTION');
}));

router.get('/api/auth/logout/', utils.ensureAuthenticated, (req, res) => {
    req.session.destroy();
    return res.redirect('/')
});


export {router as authServerRouter};
