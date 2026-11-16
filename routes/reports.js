const express = require('express');
const reports = require('../operations/reports');

const router = express.Router();

router.get('/completed', (req, res) => {
  res.json({
    status: 'completed',
    count: reports.getCountByStatus('completed'),
  });
});

router.get('/pending', (req, res) => {
  res.json({
    status: 'pending',
    count: reports.getCountByStatus('pending'),
  });
});

router.get('/in-progress', (req, res) => {
  res.json({
    status: 'in-progress',
    count: reports.getCountByStatus('in-progress'),
  });
});

router.get('/summary', (req, res) => {
  res.json(reports.getSummary());
});

module.exports = router;
