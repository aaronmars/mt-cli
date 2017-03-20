process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const vorpal = require('vorpal')();

const fetch = require('node-fetch');
global.fetch = fetch;
global.Headers = fetch.Headers;
global.Request = fetch.Request;
global.Response = fetch.Response;

const Settings = require('mindtouch-martian').Settings;
const cookieJar = require('mindtouch-http.js/lib/cookieJar');
const printer = require('./responsePrinter')(vorpal);

Settings.cookieManager = cookieJar;
const options = vorpal.parse(process.argv, { use: 'minimist' });
const connection = { host: options.host, secret: options.secret, key: options.key };

function readConnectionParams() {
    const questions = [];
    if(!connection.host) {
        questions.push({ type: 'input', name: 'host', message: 'Enter the URL of the MindTouch site to connect to:' });
    }
    if(!connection.key) {
        questions.push({ type: 'input', name: 'key', message: 'Enter dev token KEY of the MindTouch site to connect to:' });
    }
    if(!connection.secret) {
        questions.push({ type: 'input', name: 'secret', message: 'Enter dev token SECRET of the MindTouch site to connect to:' });
    }
    return new Promise((resolve) => {
        if(questions.length > 0) {
            const inquirer = require('inquirer');
            inquirer.prompt(questions).then((answers) => {
                answers.host = connection.host || answers.host;
                answers.key = connection.key || answers.key;
                answers.secret = connection.host || answers.secret;
                resolve(answers);
            });
        } else {
            resolve(connection);
        }
    });
}

vorpal.history('mt-cli-history');
readConnectionParams().then((params) => {
    const Uri = require('mindtouch-http.js').Uri;
    const hostUrl = new Uri(params.host);

    const tokenHelper = require('mindtouch-martian').TokenHelper;
    const settings = new Settings({ host: params.host, token: tokenHelper.createHelper(params.key, params.secret) });
    Settings.default.host = params.host;
    Settings.default.token = tokenHelper.createHelper(params.key, params.secret);

    require('./commands/pageCommands')(vorpal, settings, printer);
    require('./commands/fileCommands')(vorpal, settings, printer);
    require('./commands/contextIdCommands')(vorpal, settings, printer);
    require('./commands/userCommands')(vorpal, settings, printer, cookieJar, params.host);

    vorpal.delimiter(`${hostUrl.hostname} $`);
    vorpal.show();
});
