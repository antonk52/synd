const getOnFileChangeFunc = require('./getOnFileChangeFunc');
const getSyncFunc = require('./getSyncFunc');
const getFilterFile = require('./getFilterFile');
const getParsedGitignores = require('./getParsedGitignores');
const getPaths = require('./getPaths');
const log = require('./log');
const parseConfig = require('./parseConfig');

module.exports = {
    getOnFileChangeFunc,
    getSyncFunc,
    getFilterFile,
    getParsedGitignores,
    getPaths,
    log,
    parseConfig,
};
