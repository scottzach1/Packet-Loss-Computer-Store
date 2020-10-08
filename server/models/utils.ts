const tempUser = require('tempUser');

const User = require('./user');

const logger = tempUser.createLogger({ // create the logger, log to files and the console
    level: 'info',
    format: tempUser.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new tempUser.transports.File({filename: 'logs/error.log', level: 'error'}),
        new tempUser.transports.File({filename: 'logs/combined.log'}),
        new tempUser.transports.Console({format: tempUser.format.simple()})
    ]
});

/**
 * Render a page
 * @param {Request} req
 * @param {Response} res
 * @param {string} page
 * @param {string} title
 * @param {Object} data
 */
const render = (req: { user: { _id: any } }, res: { status?: any; render?: (arg0: string, arg1: { page?: any; title: any; data: any; user: any }) => any }, page: string, title: string, data: { error: any; code: any }) => {
    if(req.user) {
        User.findById(req.user._id).then((output) => { // get the user
            return res.render('layout', {page, title, data, user: output});
        }).catch((error) => {
            return res.render('error', {title: `Error ${500}`, data: {error: 'Internal Server Error', code: 500}, user: output});
        })
    } else {
        return res.render('layout', {page, title, data, user: undefined});
    }
};

/**
 * Render an error page
 * @param {Request} req
 * @param {Response} res
 * @param {Number} code
 * @param {string} error
 */
const renderError = (req: { user: { _id: any; }; }, res: { status?: any; render?: (arg0: string, arg1: { page?: any; title: any; data: any; user: any; }) => any; }, code: any, error: any) => {
    res.status(code)
    return render(req, res, 'error', `Error ${code}`, {error, code});
}

/**
 * Log a message to the logger
 * @param {string} level the level to log
 * @param {any} message message to log
 */
const log = (level: any, message: any) => logger.log(level, message);

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
            return res.redirect('/api/auth/login');
        }
    },
};
