const express = require('express');
const app = express();
const { PORT, WINDOW_SIZE, MAX_PER_WINDOW } = require('./config');
const rateLimiter = require('./services/rate-limit-service');
const ipController = require('./controllers/ip-controller');

app.use('*', rateLimiter(WINDOW_SIZE, MAX_PER_WINDOW));

app.use('/', ipController);

app.listen(PORT, (err) => {
    console.log(`Forter app is running on port ${PORT}`);
});
