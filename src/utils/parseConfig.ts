import {validatePresetConfig} from './validatePresetConfig';
import log from './log';

import {OptionalPresetFields, SyndConfig, ValidatedPreset} from '../types';

const DEFAULT_CONFIG: OptionalPresetFields = {
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

const omitServerProp = <T extends {[key: string]: unknown}>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    server,
    ...rest
}: T): Omit<T, 'server'> => rest;

export const parseConfig = (
    syndConfig: SyndConfig,
    name: string,
): ValidatedPreset => {
    if (!(name in syndConfig)) {
        log.errorAndExit(`${name} is not in your ${CONFIG_NAME} file`);
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
