const express = require('express');

const utils = require('../src/utils')

const router = express.Router();

/**
 * Get the main shop page
 * Optional parameters include:
 *  gender - the gender of the shoe
 *  brand - the brand of the shoe
 *  category - a category the shoe is part of
 *  subCategory - a sub category for the shoe
 *  maxPrice - the max price that we want to search for
 */
router.get('/', (req, res) => {
  console.log(req.query)
  return res.send('SHOP');
});

module.exports = router;
