const _ = require('lodash');
const mapper = {};

const LIMIT_MESSAGE = 'Sorry too many requests. Please try again later.';

const clearIp = (ip, windowSize) => {
    if (!mapper[ip]) {
        return;
    }
    const shouldDeleteIpEntry = mapper[ip].providers.every(({ lastFirstRequest }) => {
        return Date.now() - lastFirstRequest > windowSize;
    });
    if (shouldDeleteIpEntry) {
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
                counter: 0,
                providerName: 'ipStack',
            }, {
                lastFirstRequest: Date.now(),
                counter: 0,
                providerName: 'ipApi',
            }]
        };
    } else {
        const { currentProvider } = mapper[ip];
        const provider = mapper[ip].providers[currentProvider];
        if (currentProvider === _.get(mapper[ip], 'providers.length')) {
            return res.send(LIMIT_MESSAGE);
        }
        provider.counter++;

        const { counter, lastFirstRequest } = provider;
        if ((counter + 1) > maxPerWindow && (Date.now() - lastFirstRequest < windowSize)) {
            mapper[ip].currentProvider++;
        }
    }

    const { currentProvider } = mapper[ip];
    if (currentProvider === _.get(mapper[ip], 'providers.length')) {
        return res.send(LIMIT_MESSAGE);
    }
    req.currentProvider = mapper[ip].providers[currentProvider].providerName;
    return next();
};

module.exports = rateLimiter;