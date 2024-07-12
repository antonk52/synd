import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

import log from './log';
import type {SyndConfig} from '../types';

const CONFIG_NAME = 'synd.config.js';

const load = (configPath: string): SyndConfig | never => {
    try {
        const userConfig = require(configPath) as SyndConfig;
        if (
            typeof userConfig !== 'object' ||
            userConfig === null ||
            Array.isArray(userConfig)
        ) {
            throw new Error('invalid config');
        }
        return userConfig;
    } catch (e) {
        return log.errorAndExit(`${configPath} is not a valid synd config`);
    }
};

export const getConfig = (): SyndConfig | never => {
    if (process.env.XDG_CONFIG_HOME) {
        const configPath = path.join(process.env.XDG_CONFIG_HOME, CONFIG_NAME);
        if (fs.existsSync(configPath)) {
            return load(configPath);
        }
    }
    const configPath = path.resolve(os.homedir(), CONFIG_NAME);

    if (!fs.existsSync(configPath)) {
        return log.errorAndExit(
            `${CONFIG_NAME} does not exist, please create one to use synd`,
        );
    }

    return load(configPath);
};
