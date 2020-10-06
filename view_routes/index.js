const express = require('express');
const auth = require('./auth');
const shop = require('./shop');
const cart = require('./cart');

const router = express.Router();

router.use('/auth', auth);
router.use('/shop', shop);
router.use('/cart', cart);


router.get('/', (req, res) => {
  return utils.render(req, res, 'index', 'Home', {});
});

module.exports = router;
