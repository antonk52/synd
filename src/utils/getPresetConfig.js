'use strict'

const path = require('path');

const getHomeDir = require('./getHomeDir');

const getPresetConfig = (name) => {
    const CONFIG_NAME = '.synd.config.js';
    const configPath = path.resolve(
        getHomeDir(),
        CONFIG_NAME,
    );
    const syndConfig = {};

    if (!fs.existsSync(configPath)) {
        logErrorExit(`~/${CONFIG_NAME} does not exist`);
    }

    try {
        // eslint-disable-next-line
        const userConfig = require(configPath);
        Object.assign(syndConfig, userConfig);
    } catch (e) {
        logErrorExit(`~/${CONFIG_NAME} is invalid`);
    }

    // preset must exist
    if (!(name in syndConfig)) {
        logErrorExit(`${name} is not in your ${CONFIG_NAME} file`);
    }

    return syndConfig[name];
};

module.exports = getPresetConfig;
