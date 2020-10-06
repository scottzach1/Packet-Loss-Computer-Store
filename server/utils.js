/**
 * Render a page
 * @param {Request} req 
 * @param {Response} res 
 * @param {string} page 
 * @param {string} title 
 * @param {string} data 
 */
const render = (req, res, page, title, data) => {
  res.render('layout', {page, title, data, user: req.user});
};

module.exports = {
  render,
};
