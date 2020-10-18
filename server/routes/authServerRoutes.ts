import express, {Request, Response} from 'express';
import {loginHandler, signupHandler} from "../controller/authController";
import {render} from "ejs";

const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/login', [], async (req: Request, res: Response) => {
    const {email, password} = req.body;
    // Try handler.
    const response = await loginHandler(email, password);
    const code = (response.success) ? 200 : 400;
    // Notify sender.
    return res.status(code).json(response).send();
});

router.post(`/signup`, [], async (req: Request, res: Response) => {
    const {email, password, displayName} = req.body;
    // Try handler.
    const response = await signupHandler(email, password, displayName);
    const code = (response.success) ? 201 : 400;
    // Notify sender.
    return res.status(code).json(response).send();
});

router.get('/forgot', [], async (req: Request, res: Response) => {
    if(req.query.token) {
        User.findOne({token: req.query.token}).then((output) => {
            if(!output || output.authType !== 'local') return res.redirect('/login'); // user not found or not password auth
            if (output.token === req.query.token) { // can reset passord
                return render(req, res, 'reset', 'Reset Password', {token: req.query.token});
            }
            return renderError(req, res, 400, 'Invalid reset token');
        }).catch((error: any) => {
            log('error', error);
            return renderError(req, res, 500, 'Something went wrong');
        });
    } else {
        return render(req, res, 'forgot', 'Forgot Password', {});
    }
});

/**
 * Log a message to the logger
 * @param {string} level the level to log
 * @param {any} message message to log
 */
const log = (level: string, message: string | undefined) => logger.log(level, message);

module.exports = {
    render,
    renderError,
    log,

    /**
     * Ensure that the user is authenticated
     * @param {Request} req
     * @param {Response} res
     * @param {void} next
     */
    ensureAuthenticated: (req: { isAuthenticated: () => any; }, res: { redirect: (arg0: string) => any; }, next: () => void) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            return res.redirect('/login');
        }
    },
};

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
});

router.post('/sendReset', (req, res) => {
    const current_date = (new Date()).valueOf().toString();
    const random = Math.random().toString();
    const token = crypto.createHash('sha1').update(current_date + random).digest('hex');
    User.findOne({email: req.body.email}).then((output: { authType: string; token: any; save: () => void; }) => {
        if(!output || output.authType !== 'local') return res.redirect('/forgot'); // silent fail exit (user doesnt exist or facebook auth)
        output.token = token;
        output.save(); // save the user

        const email = { // build the email
            from: process.env.EMAIL_EMAIL,
            to: req.body.email,
            subject: 'Computer Store Password Reset',
            text: `Hello, you have requested a password reset. Navigate to \`/forgot?token=${token}\` to reset your password. You can also paste the token \`${token}\` into the token field of /forgot`,
        };

        // send the email
        transporter.sendMail(email).then((output: { accepted: any; }) => {
            log('info', 'Sent email');
            log('info', output);
            if(!output.accepted) {
                log('error', 'Email send failed');
            }
            return res.redirect('/forgot'); // valid email
        }).catch((error: any) => {
            log('error', error);
            return renderError(req, res, 500, 'Email send failed');
        });
    }).catch((error: any) => {
        log(error);
        return renderError(req, res, 500, 'Something went wrong');
    });
});

/**
 * POST /reset/
 * Checks the token supplied and resets the password if valid
 */
router.post('/reset', (req, res) => {
    if(req.body.newPass1 !== req.body.newPass2) {
        return renderError(req, res, 400, 'Passwords do not match');
    }
    bcrypt.hash(req.body.newPass1, 10, (err: any, hash: any) => { // generate new password
        User.findOne({token: req.body.token}).then((output: { token: undefined; password: any; save: () => void; }) => { // find the user with that token
            if(!output) return res.redirect('/login'); // silent fail exit
            output.token = undefined; // clear token
            output.password = hash; // update the password
            output.save(); // save the user
            return res.redirect('/login');
        }).catch((error: any) => {
            log(error, "Something went wrong");
            return renderError(req, res, 500, 'Something went wrong');
        });
    });
});

export {router as authServerRouter};
