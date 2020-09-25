# Forter Ip App

Install the dependencies and devDependencies and start the server.

```sh
$ npm install
$ node app.js
```

go to:
```
http://localhost:3000
```

The app using the following ip resolvers:
1. https://ipstack.com/
2. https://ip-api.com/

The Following api got 2 endpoints:
```
http://localhost:3000/getIPCountry
http://localhost:3000/metrics
```

You can provide the following env values:
PORT - default 3000
WINDOW_SIZE - default 1000 * 60 * 60 (ms - one hour)
MAX_PER_WINDOW - default 10


License
----
Ofer Golibroda
