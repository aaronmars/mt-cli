const ContextIdManager = require('mindtouch-martian').ContextIdManager;
const ContextDefinition = require('mindtouch-martian').ContextDefinition;
const ContextMap = require('mindtouch-martian').ContextMap;

const contextIdCommands = (vorpal, settings, printJsObj) => {
    vorpal.command('cid definitions', 'Get all of the site\'s Context Id Definitions.').action(function() {
        const cm = new ContextIdManager(settings);
        return cm.getDefinitions().then((resp) => printJsObj(this, resp));
    });
    vorpal.command('cid add <id> [description]', 'Add a new Context ID Definition.').action(function(args) {
        const cm = new ContextIdManager(settings);
        if(args.description) {
            return cm.addDefinition(args.id, args.description);
        }
        return cm.addDefinition(args.id);
    });
    vorpal.command('cid maps', 'Get all of the site\'s Context Id Definitions.').action(function() {
        const cm = new ContextIdManager(settings);
        return cm.getMaps().then((resp) => printJsObj(this, resp));
    });
    vorpal
        .command('cid definition <id>', 'Get a Context ID Definition.')
        .option('-d, --delete', 'Delete the definition')
        .option('-u, --update <description>', 'Update the Context ID Description.')
        .action(function(args) {
            const cid = new ContextDefinition(args.id, settings);
            if(args.options.delete) {
                return cid.delete();
            } else if('update' in args.options) {
                return cid.updateDescription(args.options.update).then((resp) => printJsObj(this, resp));
            }
            return cid.getInfo().then((resp) => printJsObj(this, resp));
        });
    vorpal
        .command('cid map <language> <id>', 'Get a Context ID mapping.')
        .option('-d, --delete', 'Remove the mapping.')
        .option('-p, --pageid <pageid>', 'Set the page ID for a mapping.')
        .action(function(args) {
            const map = new ContextMap(args.language, args.id, settings);
            if(args.options.delete) {
                return map.remove();
            } else if('pageid' in args.options) {
                return map.update(args.options.pageid);
            }
            return map.getInfo().then((resp) => printJsObj(this, resp));
        });
};
module.exports = contextIdCommands;
