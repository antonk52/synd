const getConfig = require('./getConfig');
const getOnFileChangeFunc = require('./getOnFileChangeFunc');
const getSyncFunc = require('./getSyncFunc');
const getFilterFile = require('./getFilterFile');
const getParsedGitignores = require('./getParsedGitignores');
const getPaths = require('./getPaths');
const log = require('./log');
const parseConfig = require('./parseConfig');

module.exports = {
    getConfig,
    getFilterFile,
    getOnFileChangeFunc,
    getSyncFunc,
    getParsedGitignores,
    getPaths,
    log,
    parseConfig,
};
