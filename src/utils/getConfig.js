const path = require('path');
const fs = require('fs');
const os = require('os');

const log = require('./log');

const CONFIG_NAME = '.synd.config.js';

const getConfig = () => {
    const homeDir = os.homedir();
    const configPath = path.resolve(homeDir, CONFIG_NAME);
    const syndConfig = {};

    if (!fs.existsSync(configPath)) {
        log.errorAndExit(`~/${CONFIG_NAME} does not exist`);
        return null;
    }

    try {
        /* eslint-disable-next-line */
        const userConfig = require(configPath);
        if (
            typeof userConfig !== 'object' ||
            userConfig === null ||
            Array.isArray(userConfig)
        ) {
            throw new Error('invalid config');
        }
        Object.assign(syndConfig, userConfig);
    } catch (e) {
        log.errorAndExit(`~/${CONFIG_NAME} is invalid`);
        return null;
    }

    return syndConfig;
};

module.exports = getConfig;
