const fs = require('mz/fs');
const path = require('path');
const Page = require('mindtouch-martian/page').Page;

function makePage(id = 'home') {
    return new Page(id);
}
const pageCommands = (vorpal, printJsObj) => {
    vorpal.command('page info', 'Gets information about a page.')
        .option('-i, --page-id [id]', 'The ID of the page.')
        .option('-f, --full', 'Get the full info.')
        .action((args) => {
            const page = makePage(args.options['page-id']);
            if(args.options.full === true) {
                return page.getFullInfo().then((resp) => {
                    return printJsObj(resp);
                });
            }
            return page.getInfo().then((resp) => {
                return printJsObj(resp);
            });
        });
    vorpal.command('page subpages', 'Gets the subpages of a page.')
        .option('-i, --page-id [id]', 'The ID of the page.')
        .action((args) => {
            const page = makePage(args.options['page-id']);
            return page.getSubpages().then((resp) => {
                return printJsObj(resp);
            });
        });
    vorpal.command('page contents', 'Gets and sets the contents of a page')
        .option('-i, --page-id [id]', 'The ID of the page.')
        .option('-c, --contents <contents>', 'The string to set as the contents.')
        .action((args) => {
            const page = makePage(args.options['page-id']);
            if('contents' in args.options) {
                return page.setContents(args.options.contents).then((resp) => {
                    return printJsObj(resp);
                });
            }
            return page.getContents().then((resp) => {
                return printJsObj(resp);
            });
        });
    vorpal.command('page tree', 'Gets a page tree representation.')
        .option('-i, --page-id [id]', 'The ID of the page.')
        .action((args) => {
            const page = makePage(args.options['page-id']);
            return page.getTree().then((resp) => {
                return printJsObj(resp);
            });
        });
    vorpal.command('page tree-ids', 'Gets a page tree representation.')
        .option('-i, --page-id [id]', 'The ID of the page.')
        .action((args) => {
            const page = makePage(args.options['page-id']);
            return page.getTreeIds().then((resp) => {
                return printJsObj(resp);
            });
        });
    vorpal.command('page rating', 'Gets a page rating.')
        .option('-i, --page-id [id]', 'The ID of the page.')
        .action((args) => {
            const page = makePage(args.options['page-id']);
            return page.getRating().then((resp) => {
                return printJsObj(resp);
            });
        });
    vorpal.command('page rate', 'Sets the rating for a page.')
        .option('-i, --page-id [id]', 'The ID of the page.')
        .option('-o, --old <old>', 'The previous revision')
        .option('-n, --new <new>', 'The new revision to set')
        .action((args) => {
            const page = makePage(args.options['page-id']);
            const ratings = [];
            if('new' in args.options) {
                ratings.push(args.options.new);
                if('old' in args.options) {
                    ratings.push(args.options.new);
                }
            }
            return page.rate(...ratings);
        });
    vorpal.command('page overview', 'Gets and sets the page overview text.')
        .option('-i, --page-id [id]', 'The ID of the page.')
        .option('-t, --text <text>', 'The overview text to set.')
        .action((args) => {
            const page = makePage(args.options['page-id']);
            if('text' in args.options) {
                return page.setOverview({ body: args.options.text });
            }
            return page.getOverview().then((r) => {
                return printJsObj(r);
            });
        });
    vorpal.command('page delete', 'Delete the specified page.')
        .option('-i, --page-id [id]', 'The ID of the page.')
        .option('-r, --recursive', 'Delete all descendant pages as well.')
        .action((args) => {
            const recursive = args.options.recursive === true;
            const page = makePage(args.options['page-id']);
            return page.delete(recursive).then((r) => {
                return printJsObj(r);
            });
        });
    vorpal.command('page files', 'Get a listing of a page\'s files.')
        .option('-i, --page-id [id]', 'The ID of the page.')
        .action((args) => {
            const page = makePage(args.options['page-id']);
            return page.getFiles().then((r) => {
                return printJsObj(r);
            });
        });
    vorpal.command('page attach', 'Attach a file to the specified page.')
        .option('-i, --page-id [id]', 'The ID of the page.')
        .option('-f, --file <file>', 'The path to the file to attach')
        .option('-t, --type <type>', 'The mime type of the file')
        .action((args) => {
            return fs.stat(args.options.file).then((stats) => {
                const fileStream = fs.createReadStream(args.options.file);
                const page = makePage(args.options['page-id']);
                const fileInfo = { name: path.basename(args.options.file), size: stats.size };
                if(args.options.type) {
                    fileInfo.type = args.options.type;
                }
                return page.attachFile(fileStream, fileInfo).then((r) => {
                    return printJsObj(r);
                });
            });
        });
    vorpal.command('page tags', 'Get a listing of a page\'s tags.')
        .option('-i, --page-id [id]', 'The ID of the page.')
        .action((args) => {
            const page = makePage(args.options['page-id']);
            return page.getTags().then((r) => {
                return printJsObj(r);
            });
        });
    vorpal.command('page related', 'Gets related pages for a page.')
        .option('-i, --page-id [id]', 'The ID of the page.')
        .action((args) => {
            const page = makePage(args.options['page-id']);
            return page.getRelated().then((r) => {
                return printJsObj(r);
            });
        });
    vorpal.command('page import', 'Imports an MT archive under the specified page')
        .option('-i, --page-id [id]', 'The ID of the page.')
        .option('-f, --file <file>', 'The .mtarc file to import.')
        .option('-d, --delete-redirects', 'If the target of the import is a redirect, force the import.')
        .action((args) => {
            return fs.stat(args.options.file).then((stats) => {
                const fileStream = fs.createReadStream(args.options.file);
                const page = makePage(args.options['page-id']);
                const fileInfo = { name: path.basename(args.options.file), size: stats.size };
                const params = {};
                if(args.options['delete-redirects']) {
                    params.allow = 'deleteredirects';
                }
                return page.importArchive(fileStream, fileInfo, params).then((r) => {
                    return printJsObj(r);
                });
            });
        });
};
module.exports = pageCommands;
