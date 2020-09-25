const express = require('express');
const router = express.Router();
const { fetchMetrics } = require('../services/ip-service');

router.get('/', (req, res) => res.json(fetchMetrics()));

module.exports = router;