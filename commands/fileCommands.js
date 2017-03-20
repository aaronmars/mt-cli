const fs = require('mz/fs');
const path = require('path');
const File = require('mindtouch-martian').File;

const fileCommands = (vorpal, settings, printJsObj) => {
    vorpal.command('file revision', 'Upload a new file revision for the specified file.')
        .option('-i, --file-id <id>', 'The ID of the file to revise.')
        .option('-f, --file <file>', 'The file to upload as the new revision.')
        .option('-t, --type <type>', 'The mime type of the file being added.')
        .action((args) => {
            return fs.stat(args.options.file).then((stats) => {
                const fileStream = fs.createReadStream(args.options.file);
                const fileApi = new File(args.options['file-id'], settings);
                const fileInfo = { name: path.basename(args.options.file), size: stats.size };
                if(args.options.type) {
                    fileInfo.type = args.options.type;
                }
                return fileApi.addRevision(fileStream, fileInfo).then((r) => {
                    return printJsObj(r);
                });
            });
        });
};
module.exports = fileCommands;
