import path from 'path';
import fs from 'fs';
import os from 'os';

import log from './log';
import {SyndConfig} from '../types';

const CONFIG_NAME = '.synd.config.js';

export const getConfig = (): SyndConfig | never => {
    const homeDir = os.homedir();
    const configPath = path.resolve(homeDir, CONFIG_NAME);
    const syndConfig = {};

    if (!fs.existsSync(configPath)) {
        log.errorAndExit(`~/${CONFIG_NAME} does not exist`);
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
    }

    return syndConfig;
};
