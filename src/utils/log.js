/* istanbul ignore file */
const process = require('process');
const chalk = require('chalk');

const stamp = () => {
    const d = new Date();

    return `[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`;
};

const log = string =>
    process.stdout.write(`${chalk.gray(stamp())} ${string}\n`);

const plain = string => process.stdout.write(`${string}\n`);

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

module.exports = Object.assign(log, {errorAndExit, plain});
