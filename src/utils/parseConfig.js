const validatePresetConfig = require('./validatePresetConfig');
const log = require('./log');

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
const CONFIG_NAME = '.synd.config.js';

const omitServerProp = ({server, ...rest}) => rest;

const parseConfig = (syndConfig, name) => {
    if (!(name in syndConfig)) {
        log.errorAndExit(`${name} is not in your ${CONFIG_NAME} file`);
        return null;
    }
    const presetConfig = syndConfig[name];

    validatePresetConfig(presetConfig, name);

    // TODO move to pre execute helper
    const dest =
        presetConfig.server && typeof presetConfig.server === 'string'
            ? `${presetConfig.server}:${presetConfig.dest}`
            : presetConfig.dest;

    return {...DEFAULT_CONFIG, ...omitServerProp(presetConfig), dest, name};
};

module.exports = parseConfig;
