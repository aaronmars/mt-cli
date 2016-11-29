const chalk = require('chalk');

function _printObject(command, obj, indent) {
    Object.keys(obj).sort().forEach((key) => {
        if(key === '_unparsedProperties') {
            return;
        }
        let val = obj[key];
        if(val instanceof Date) {
            val = val.toString();
        }
        if(Array.isArray(val) && val.length === 0) {
            command.log(`${' '.repeat(indent)}${chalk.red(key)}: ${chalk.cyan('[]')}`);
        } else if(typeof val === 'object') {
            command.log(`${' '.repeat(indent)}${chalk.red(key)}:`);
            _printObject(command, val, indent + 4);
        } else {
            command.log(`${' '.repeat(indent)}${chalk.red(key)}: ${chalk.cyan(val)}`);
        }
    });
}

const printJsObj = (vorpal) => {
    return (obj, indent = 0) => {
        const command = vorpal.activeCommand;
        _printObject(command, obj, indent);
    };
};
module.exports = printJsObj;
