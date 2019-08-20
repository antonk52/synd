const log = require('./log');

const tapAboutToSync = data => {
    log(`about to sync \n\t${data.src} to \n\t${data.dest}\n\n`);

    return data;
};

module.exports = tapAboutToSync;
