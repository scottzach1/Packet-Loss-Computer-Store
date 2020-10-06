const express = require('express');

const utils = require('../../server/utils')

const router = express.Router();

router.get('/', (req, res) => {
  return res.send('CART');
});

router.get('/checkout', (req, res) => {

});

router.get('/complete', (req, res) => {

});

/**
 * Clear the users cart
 */
router.get('/clear', (req, res) => {

});

module.exports = router;
