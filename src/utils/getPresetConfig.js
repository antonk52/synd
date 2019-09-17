'use strict'

const path = require('path');
const fs = require('fs');

const getHomeDir = require('./getHomeDir');
const log = require('./log');

const CONFIG_NAME = '.synd.config.js';

const getPresetConfig = (name) => {
    const homeDir = getHomeDir();
    const configPath = path.resolve(
        homeDir,
        CONFIG_NAME,
    );
    const syndConfig = {};

    if (!fs.existsSync(configPath)) {
        log.errorAndExit(`~/${CONFIG_NAME} does not exist`);
        return;
    }

    try {
        const userConfig = require(configPath);
        if (
            typeof userConfig !== 'object'
            || userConfig === null
            || Array.isArray(userConfig)
        ) {
            throw new Error('invalid config');
        }
        Object.assign(syndConfig, userConfig);
    } catch (e) {
        log.errorAndExit(`~/${CONFIG_NAME} is invalid`);
        return;
    }

    // preset must exist
    if (!(name in syndConfig)) {
        log.errorAndExit(`${name} is not in your ${CONFIG_NAME} file`);
        return;
    }

    return syndConfig[name];
};

module.exports = getPresetConfig;
