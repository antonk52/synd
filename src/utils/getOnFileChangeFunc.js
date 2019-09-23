const chalk = require('chalk');

const log = require('./log');

const getOnFileChangeFunc = data => {
    function onFileChangeFunc(eventType, filename) {
        log(`${chalk.yellow(eventType)} ${filename}`);
        data.syncFunc();
    }

    return onFileChangeFunc;
};

module.exports = getOnFileChangeFunc;
