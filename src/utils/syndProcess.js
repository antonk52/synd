const {flowRight} = require('lodash');

const Rsync = require('../rsync');
const {
    addOnFileChangeFunc,
    addSyncFunc,
    filterFile,
    getPaths,
    logRsyncCommand,
    parseConfig,
    startWatchingChanges,
    tapAboutToSync,
    tapIntro,
} = require('./');

const syndProcess = flowRight([
    startWatchingChanges,
    addOnFileChangeFunc,
    addSyncFunc,
    logRsyncCommand,
    Rsync,
    tapAboutToSync,
    filterFile,
    getPaths,
    parseConfig,
    tapIntro,
]);

module.exports = syndProcess;
