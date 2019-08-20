const addOnFileChangeFunc = require('./addOnFileChangeFunc');
const addSyncFunc = require('./addSyncFunc');
const filterFile = require('./filterFile');
const getParsedGitignores = require('./getParsedGitignores');
const getPaths = require('./getPaths');
const log = require('./log');
const logErrorExit = require('./logErrorExit');
const logRsyncCommand = require('./logRsyncCommand');
const parseConfig = require('./parseConfig');
const startWatchingChanges = require('./startWatchingChanges');
const tapAboutToSync = require('./tapAboutToSync');
const tapIntro = require('./tapIntro');

module.exports = {
    addOnFileChangeFunc,
    addSyncFunc,
    filterFile,
    getParsedGitignores,
    getPaths,
    log,
    logErrorExit,
    logRsyncCommand,
    parseConfig,
    startWatchingChanges,
    tapAboutToSync,
    tapIntro,
};
