const process = require('process');

const chalk = require('chalk');
const tinydate = require('tinydate');

const {dateFormat} = require('../constants');

const stamp = tinydate(dateFormat);

const log = string => process.stdout.write(`${chalk.gray(stamp())} ${string}\n`);

module.exports = log;
