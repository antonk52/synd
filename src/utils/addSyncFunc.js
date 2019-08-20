const chalk = require('chalk');
const {debounce} = require('lodash');

const log = require('./log');

const logDoneUploading = () => log(`${chalk.green('done')}`);

const addSyncFunc = data => {
    const syncFunc = debounce(
        () => data.rsyncFunc.execute(logDoneUploading),
        100,
    );

    return {
        ...data,
        syncFunc,
    };
};

module.exports = addSyncFunc;
