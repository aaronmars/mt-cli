const userLib = require('mindtouch-martian/user');
const User = userLib.User;
const UserManager = userLib.UserManager;

function makeUser(id = 'current') {
    return new User(id);
}
const userCommands = (vorpal, printJsObj, cookieJar, connection) => {
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
            const um = new UserManager();
            return um.authenticate({ username: args.options.username, password: args.options.password, method: method })
                .then((r) => printJsObj({ 'Auth Token': r }))
                .catch((e) => vorpal.activeCommand.log(e));
        });
    vorpal.command('users logout').action(() => {
        return cookieJar.getCookies(connection.host).then((cookies) => {
            const expiredCookies = [];
            cookies.forEach((cookie) => {
                if(cookie.key === 'authtoken' || cookie.key === 'secureauthtoken') {
                    cookie.setMaxAge('-Infinity');
                    expiredCookies.push(cookie);
                }
            });
            return expiredCookies;
        }).then((setCookies) => {
            return cookieJar.storeCookies(connection.host, setCookies);
        });
    });
};
module.exports = userCommands;
