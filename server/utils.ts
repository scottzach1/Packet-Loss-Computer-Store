import {Request, Response} from 'express';

/**
 * A stylised render that applies the general layout, as well as a mechanism to pass information to the page.
 *
 * @param req - TODO
 * @param res - TODO
 * @param page - TODO
 * @param title - TODO
 * @param data - TODO
 */
const render = (req: Request, res: Response, page: string, title: string, data: any) => {
    res.render('layout', {page, title, data, user: null});
};

export {render};
