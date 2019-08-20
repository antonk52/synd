const chalk = require('chalk');

const log = require('./log');

const addOnFileChangeFunc = data => {
    function onFileChangeFunc(eventType, filename) {
        log(`${chalk.yellow(eventType)} ${filename}`);
        data.syncFunc();
    }

    return {
        ...data,
        onFileChangeFunc,
    };
};

module.exports = addOnFileChangeFunc;
