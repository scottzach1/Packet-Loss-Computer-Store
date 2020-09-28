const express = require('express');

const utils = require('../src/utils')

const router = express.Router();

router.get('/login/', (req, res) => {
  return res.send('LOGIN');
});

router.get('/signup/', (req, res) => {
  return res.send('SIGNUP');
});

router.get('/logout/', (req, res) => {
  return res.send('LOGOUT');
});

module.exports = router;
