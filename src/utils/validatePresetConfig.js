const fs = require('fs');
const log = require('./log');

const validateConfig = (config, name) => {
    // src must be set
    if (typeof config.src !== 'string') {
        log.errorAndExit(
            `Empty 'src' in ${name} preset. Make sure property 'name' is set.`,
        );
    }

    // src must exist
    if (!fs.existsSync(config.src)) {
        log.errorAndExit(
            `Invalid 'src' in ${name} preset. Make sure property 'name' is set to a valid path`,
        );
    }

    // dest must be set
    if (typeof config.dest !== 'string') {
        log.errorAndExit(
            `Invalid 'dest' property in "${name}". Make sure property 'dest' is set to a valid path.`,
        );
    }

    // TODO checks for the rest config options

    return true;
};

module.exports = validateConfig;
