import {Request, Response} from 'express';

/**
 * A stylised render that applies the general layout, as well as a mechanism to pass information to the page.
 *
 * @param req - The request from Nodejs
 * @param res - The response from Nodejs
 * @param page -The path of the page within the `client/views` page.
 * @param title - The title of the web page.
 * @param data - Any additional data passed to the EJS webpage.
 */
const render = (req: Request, res: Response, page: string, title: string, data: any) => {
    res.render('layout', {page, title, data, user: null});
};

export {render};
