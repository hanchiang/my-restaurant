const express = require('express');
const router = express.Router();


// Do work here
router.get('/', (req, res) => {
  res.render('layout', { title: 'My Express App' });
});

router.get('/stores', (req, res) => {
  res.render('layout', { title: 'Stores' });
});

module.exports = router;
