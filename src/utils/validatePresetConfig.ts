import fs from 'node:fs';
import log from './log';

import type {Preset} from '../types';

export const validatePresetConfig = (
    preset: Preset,
    name: string,
): undefined | never => {
    // src must be set
    if (typeof preset.src !== 'string') {
        log.errorAndExit(
            `Empty 'src' in ${name} preset. Make sure property 'name' is set.`,
        );
    }

    // src must exist
    if (!fs.existsSync(preset.src)) {
        log.errorAndExit(
            `Invalid 'src' in ${name} preset. Make sure property 'name' is set to a valid path`,
        );
    }

    // dest must be set
    if (typeof preset.dest !== 'string') {
        log.errorAndExit(
            `Invalid 'dest' property in "${name}". Make sure property 'dest' is set to a valid path.`,
        );
    }

    // TODO checks for the rest preset options
};
