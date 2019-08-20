const path = require('path');
const fs = require('fs');

const getHomeDir = require('./getHomeDir');
const logErrorExit = require('./logErrorExit');

const CONFIG_NAME = '.synd.config.js';

const parseConfig = name => {
    const configPath = path.resolve(
        getHomeDir(),
        CONFIG_NAME,
    );
    const wholeConfig = {};
    const config = {};

    if (!fs.existsSync(configPath)) {
        logErrorExit(`~/${CONFIG_NAME} does not exist`);
    }

    try {
        // eslint-disable-next-line
        const userConfig = require(configPath);
        Object.assign(wholeConfig, userConfig);
    } catch (e) {
        logErrorExit(`~/${CONFIG_NAME} is invalid`);
    }

    // preset must exist
    if (!(name in wholeConfig)) {
        logErrorExit(`${name} is not in your ${CONFIG_NAME} file`);
    }

    Object.assign(config, wholeConfig[name]);

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

    return {
        ...config,
        dest,
        init: !!config.init,
        name,
    };
};

module.exports = parseConfig;
