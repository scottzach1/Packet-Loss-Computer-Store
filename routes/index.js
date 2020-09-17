const express = require('express');

const utils = require('../src/utils')

const router = express.Router();

router.get('/', (req, res) => {
  return utils.render(req, res, 'index', 'Home', {});
});

module.exports = router;
