require('babel-register')({
    ignore: function(filename) {
        const isNodeModule = (/node_modules/).test(filename);
        const isMtLib = (/mindtouch-http/).test(filename) || (/mindtouch-martian/).test(filename);
        return isNodeModule && !isMtLib;
    },
    sourceMaps: true
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const vorpal = require('vorpal')();

// Includes from mindtouch-http to help with node apps
const fetch = require('node-fetch');
global.fetch = fetch;
global.Headers = fetch.Headers;
global.Request = fetch.Request;
global.Response = fetch.Response;

const cookieJar = require('mindtouch-http.js/lib/cookieJar');
const printer = require('./responsePrinter')(vorpal);
const options = vorpal.parse(process.argv, { use: 'minimist' });
const connection = { host: options.host, secret: options.secret, key: options.key };

require('./commands/pageCommands')(vorpal, printer);
require('./commands/fileCommands')(vorpal, printer);
require('./commands/contextIdCommands')(vorpal, printer);
require('./commands/userCommands')(vorpal, printer, cookieJar, connection);
require('./connectMode')(vorpal, connection, cookieJar);
if(!connection.host) {
    connection.key = null;
    connection.secret = null;
} else if(!connection.key) {
    connection.secret = null;
}

let connectCmd = 'connect';
if(connection.host) {
    connectCmd = `${connectCmd} -h ${connection.host}`;
}
if(connection.key) {
    connectCmd = `${connectCmd} -k ${connection.key}`;
}
if(connection.secret) {
    connectCmd = `${connectCmd} -s ${connection.secret}`;
}
vorpal.exec(connectCmd);
vorpal.history('mt-cli-history');
vorpal.show();
