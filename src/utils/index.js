const addOnFileChangeFunc = require('./addOnFileChangeFunc');
const addSyncFunc = require('./addSyncFunc');
const filterFile = require('./filterFile');
const getParsedGitignores = require('./getParsedGitignores');
const getPaths = require('./getPaths');
const log = require('./log');
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
    logRsyncCommand,
    parseConfig,
    startWatchingChanges,
    tapAboutToSync,
    tapIntro,
};
