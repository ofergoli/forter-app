const express = require('express');
const router = express.Router();

router.get('/getIPCountry', (req, res) => {
    // const {ip} = req;
    // const ip = '93.172.203.125';
    return res.json({ ip: '(:' });
})

module.exports = router;