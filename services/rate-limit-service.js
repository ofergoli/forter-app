const mapper = {};

const clearIp = (ip, windowSize) => {
    if (!mapper[ip]) {
        return;
    }
    if (Date.now() - mapper[ip].lastFirstRequest > windowSize) {
        delete mapper[ip];
    }
}

const rateLimiter = (windowSize, maxPerWindow) => (req, res, next) => {
    const { ip } = req;

    clearIp(ip, windowSize);

    if (!mapper[ip]) {
        mapper[ip] = {
            currentProvider: 0,
            providers: [{
                lastFirstRequest: Date.now(),
                counter: 1,
            }]
        };
    } else {
        mapper[ip].counter++;
    }

    const { currentProvider } = mapper[ip];
    const { maxPerWindow, lastFirstRequest } = mapper[ip].providers[currentProvider]
    if (counter > maxPerWindow && (Date.now() - lastFirstRequest < windowSize)) {
        return res.send('Sorry to mant requests. Please try again later.');
    }
    return next();
};

module.exports = rateLimiter;