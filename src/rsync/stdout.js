const chalk = require('chalk');

const {log} = require('../utils');

const stdout = buffer => {
    // break the buffer into an array of strings
    const output = `${buffer}`
        .trim()
        .replace('/{2,}/g', '\n')
        .replace('/\t{1,}/g', '\n')
        .split('\n');

    // eliminate upload info
    const files = output.filter(f => {
        if (
            /\d{1,2}kB\/s/g.test(f) ||
            f.includes('building file list') ||
            f.includes('files to consider') ||
            f.includes('bytes  received') ||
            f.includes('total size') ||
            f.includes('speedup is') ||
            f.includes('to-check=') ||
            f.includes('files...') ||
            f.includes('xfer#1,') ||
            f === '' ||
            f === './'
        )
            return false;

        return true;
    });

    files.forEach(name => log(`${chalk.yellow('uploading')}  ${name}`));
};

module.exports = stdout;
