const userLib = require('mindtouch-martian');
const User = userLib.User;
const UserManager = userLib.UserManager;

const userCommands = (vorpal, settings, printJsObj, cookieJar, host) => {
    function makeUser(id = 'current') {
        return new User(id, settings);
    }
    vorpal.command('user info', 'Get the information about a user.')
        .option('-i, --user-id [id]', 'The id of the user to fetch.')
        .action((args) => {
            const user = makeUser(args.options['user-id']);
            return user.getInfo().then((r) => {
                return printJsObj(r);
            });
        });
    vorpal.command('users authenticate')
        .option('-u, --username <username>', 'The username to use for authentication')
        .option('-p, --password <password>', 'The password to use for authentication')
        .option('-m, --method [method]', 'The method to use to communicate with the API for Authentication', [ 'GET', 'POST' ])
        .action((args) => {
            const method = args.options.method || 'GET';
            const um = new UserManager(settings);
            return um.authenticate({ username: args.options.username, password: args.options.password, method: method })
                .then((r) => printJsObj({ 'Auth Token': r }))
                .catch((e) => vorpal.activeCommand.log(e));
        });
    vorpal.command('users logout').action(() => {
        return cookieJar.getCookies(host).then((cookies) => {
            const expiredCookies = [];
            cookies.forEach((cookie) => {
                if(cookie.key === 'authtoken' || cookie.key === 'secureauthtoken') {
                    cookie.setMaxAge('-Infinity');
                    expiredCookies.push(cookie);
                }
            });
            return expiredCookies;
        }).then((setCookies) => {
            return cookieJar.storeCookies(host, setCookies);
        });
    });
};
module.exports = userCommands;
