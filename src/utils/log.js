const process = require('process');

const chalk = require('chalk');
const tinydate = require('tinydate');

const stamp = tinydate('[{HH}:{mm}:{ss}]');

const log = string => process.stdout.write(`${chalk.gray(stamp())} ${string}\n`);

const errorAndExit = reason => {
    const output = [
        '\n\n',
        chalk.bgRed.black(' Exiting now '),
        '\n\n',
        'reason: ',
        chalk.dim.yellow(reason),
        '\n\n',
    ].join('');
    process.stdout.write(output);
    process.exit(1);
};

module.exports = Object.assign(
    log,
    {errorAndExit}
);
