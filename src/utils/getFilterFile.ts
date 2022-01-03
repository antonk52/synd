import fs from 'fs';
import path from 'path';

import os from 'os';
import log from './log';
import {getMd5Hash} from './getMd5Hash';

type Params = {
    include: string[];
    exclude: string[];
    name: string;
};

function getFilterDirPath(): string {
    const version: string = require('../../package.json').version;
    if (process.env.XDG_CACHE_HOME) {
        return path.resolve(process.env.XDG_CACHE_HOME, 'synd', version);
    }

    const cacheDir = path.join(os.homedir(), '.cache');
    if (fs.existsSync(cacheDir)) {
        return path.resolve(cacheDir, 'synd', version);
    }

    return path.resolve(os.homedir(), '.synd');
}

export const getFilterFile = ({
    include,
    exclude,
    name,
}: Params): string | null => {
    if (include.length === 0 && exclude.length === 0) {
        return null;
    }
    // TODO swap excludes with includes
    const content = [
        exclude.map(rule => `- ${rule}`).join('\n'),
        include.map(rule => `+ ${rule}`).join('\n'),
    ].join('\n');

    const hash = getMd5Hash(content);

    const filterDirPath = getFilterDirPath();

    if (!fs.existsSync(filterDirPath)) {
        log("synd cache dir not present, so let's create it");
        fs.mkdirSync(filterDirPath, {recursive: true});
    }

    const filterFileName = `${name}.${hash}.filter`;

    const filterFilePath = path.resolve(filterDirPath, filterFileName);

    if (!fs.existsSync(filterFilePath)) {
        log(`filter file not preset, creating ${filterFilePath}`);

        fs.writeFileSync(filterFilePath, content);
    } else {
        log(`found filter file, using it "${filterFilePath}"`);
    }

    return filterFilePath;
};
