const express = require('express');
const router = express.Router();
const { fetchIp } = require('../services/ip-service');

router.get('/getIPCountry', async (req, res) => {
    const providerName = req.currentProvider;
    // const { ip } = req;
    const ip = '93.172.203.125';
    try {
        return res.json(await fetchIp(providerName, ip));
    } catch (err) {
        return res.sendStatus(400);
    }
});

module.exports = router;