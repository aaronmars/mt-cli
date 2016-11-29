const connectMode = (vorpal, connection, cookieJar) => {
    let mode = 'host';
    function _getPrompt() {
        const cmd = vorpal.activeCommand;
        if(connection.host) {
            cmd.log(`HOST: ${connection.host}`);
            cmd.log();
        } else {
            mode = 'host';
            cmd.log('What is the host you\'d like to connect to?');
            cmd.delimiter('host ');
            return;
        }
        if(connection.key) {
            cmd.log(`KEY: ${connection.key}`);
            cmd.log();
        } else {
            mode = 'key';
            cmd.log(`What is the API key for connecting to ${connection.host}?`);
            cmd.delimiter('key ');
            return;
        }

        // if connection.secret exists here, everything is all set up to connect.
        // Set the host as the delimiter and exit the connect mode
        if(connection.secret) {
            const Uri = require('mindtouch-martian/http').Uri;
            const hostUrl = new Uri(connection.host);

            // Set up the Settings for Plug
            const Settings = require('mindtouch-martian/lib/settings').Settings;
            const tokenHelper = require('mindtouch-martian/lib/tokenHelper').tokenHelper;
            Settings.default.host = connection.host;
            Settings.default.token = tokenHelper.createHelper(connection.key, connection.secret);
            Settings.cookieManager = cookieJar;

            vorpal.delimiter(`${hostUrl.hostname} $`);
            vorpal.exec('exit');
        } else {
            mode = 'secret';
            cmd.log(`What is the secret for connecting to ${connection.host}?`);
            cmd.delimiter('secret ');
            return;
        }
    }
    return vorpal.mode('connect')
        .description('Connect to a MindTouch site.')
        .option('-h, --host [host]', 'The MindTouch site to connect to.')
        .option('-k, --key [key]', 'The API key to use to connect.')
        .option('-s, --secret [secret]', 'The API key secret token.')
        .delimiter('')
        .init((args) => {
            connection.host = args.options.host;
            connection.key = args.options.key;
            connection.secret = args.options.secret;
            vorpal.activeCommand.log('Connecing to a MindTouch site.');
            vorpal.activeCommand.log();
            _getPrompt();
            return Promise.resolve();
        })
        .action((command) => {
            connection[mode] = command;
            _getPrompt();
            return Promise.resolve();
        });
};
module.exports = connectMode;
