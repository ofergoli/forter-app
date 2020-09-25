const axios = require('axios');
const { IP_STACK_ACCESS_KEY } = require('./../config');

const ipStackFetcher = ip => axios.get(`http://api.ipstack.com/${ip}?access_key=${IP_STACK_ACCESS_KEY}&format=1`);
const ipApi = ip => axios.get(`http://ip-api.com/json/${ip}`);

const metrics = {
    ipStack: [],
    ipApi: [],
}

const addMetric = (arr, val) => {
    arr.push(val);
    i = arr.length - 1;
    item = arr[i];
    while (i > 0 && item < arr[i - 1]) {
        arr[i] = arr[i - 1];
        i -= 1;
    }
    arr[i] = item;
}

const resolveIpStackRequest = async (ipValue) => {
    try {
        const start = Date.now();
        const { data: { ip, country_name: countryName } } = await ipStackFetcher(ipValue);
        const apiLatency = Date.now() - start;
        addMetric(metrics.ipStack, apiLatency);
        return { apiLatency, ip, countryName, vendor: 'ipstack' };
    } catch (err) {
        new Error('Ip Stack Issue');
    }
}

const resolveApiIpRequest = async (ipValue) => {
    try {
        const start = Date.now();
        const { data: { query: ip, country: countryName } } = await ipApi(ipValue);
        const apiLatency = Date.now() - start;
        addMetric(metrics.ipApi, apiLatency);
        return { apiLatency, ip, countryName, vendor: 'ip-api' };
    } catch (err) {
        new Error('Ip Stack Issue');
    }
}

const fetchIp = async (provider, ip) => {
    try {
        switch (provider) {
            case 'ipStack':
                return await resolveIpStackRequest(ip);
            case 'ipApi':
                return await resolveApiIpRequest(ip);
            default:
                return {};
        }
    } catch (err) {
        throw new Error('Something went wrong');
    }
}

const fetchMetrics = () => {
    const result = {};
    for (let metric in metrics) {
        result[metric] = {
            percentile50: metrics[metric][Math.floor(0.5 * metrics[metric].length)] || 0,
            percentile75: metrics[metric][Math.floor(0.75 * metrics[metric].length)] || 0,
            percentile95: metrics[metric][Math.floor(0.95 * metrics[metric].length)] || 0,
            percentile99: metrics[metric][Math.floor(0.99 * metrics[metric].length)] || 0,
        }
    }
    return result;
}

module.exports = { fetchIp, fetchMetrics };