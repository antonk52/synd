const log = require('./log');

const logRsyncCommand = data => {
    if (data.showRsyncCommand) log(`command\n\n${data.rsyncFunc.command()}`);

    return data;
};

module.exports = logRsyncCommand;
