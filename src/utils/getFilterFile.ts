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

    const filterDirPath = path.resolve(os.homedir(), '.synd');

    if (!fs.existsSync(filterDirPath)) {
        log(".synd dir not present, so let's create it");
        fs.mkdirSync(filterDirPath);
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
