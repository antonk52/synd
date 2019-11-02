const chalk = require('chalk');
const debounce = require('lodash.debounce');

const log = require('./log');

const logDoneUploading = () => log(`${chalk.green('done')}`);

const getSyncFunc = data => {
    const syncFunc = debounce(
        () => data.rsyncFunc.execute(logDoneUploading),
        100,
    );

    return syncFunc;
};

module.exports = getSyncFunc;
