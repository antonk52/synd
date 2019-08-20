const chalk = require('chalk');

const logErrorExit = reason => {
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

module.exports = logErrorExit;
