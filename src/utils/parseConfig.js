const fs = require('fs');

const logErrorExit = require('./logErrorExit');
const getPresetConfig = require('./getPresetConfig');

const DEAFULT_CONFIG = {
    initSync: false,
    watch: true,
};

const parseConfig = name => {
    const config = getPresetConfig();

    // src must be set
    if (!config.src && typeof config.src === 'string') {
        logErrorExit(`Empty 'src' in ${name} preset. Make sure property 'name' is set.`);
    }

    // src must exist
    if (!fs.existsSync(config.src)) {
        logErrorExit(`Invalid 'src' in ${name} preset. Make sure property 'name' is set to a valid path`);
    }

    // dest must be set
    if (!config.dest && typeof config.dest === 'string') {
        logErrorExit(`Empty 'dest' property in ${name}. Make sure property 'dest' is set.`);
    }

    // TODO move to pre execute helper
    const dest = config.server && typeof config.server === 'string'
        ? `${config.server}:${config.dest}`
        : config.dest;

    return Object.assign({}, DEAFULT_CONFIG, {
        ...config,
        dest,
        name,
    });
};

module.exports = parseConfig;
