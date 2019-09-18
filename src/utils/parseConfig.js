const _ = require('lodash');

const getPresetConfig = require('./getPresetConfig');
const validatePresetConfig = require('./validatePresetConfig');

const DEFAULT_CONFIG = {
    initSync: false,
    watch: true,
    include: [],
    exclude: [],
    globalGitignore: false,
    localGitignore: false,
    parseOutput: false,
    showRsyncCommand: false,
};

const parseConfig = name => {
    const presetConfig = getPresetConfig(name);

    validatePresetConfig(presetConfig, name);

    // TODO move to pre execute helper
    const dest =
        presetConfig.server && typeof presetConfig.server === 'string'
            ? `${presetConfig.server}:${presetConfig.dest}`
            : presetConfig.dest;

    return Object.assign({}, DEFAULT_CONFIG, _.omit(presetConfig, ['server']), {
        dest,
        name,
    });
};

module.exports = parseConfig;
