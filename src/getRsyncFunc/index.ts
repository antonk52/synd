import fs from 'fs';
import RsyncPkg from 'rsync';

import {onStdout} from './stdout';
import {log} from '../utils';

import {ValidatedPreset} from '../types';

function writeToStdout(b: Buffer): void {
    process.stdout.write(String(b));
}

function onError(...data: string[]): void {
    log('------ STERR');
    data.forEach(log);
}

type Param = ValidatedPreset & {
    filterFilePath: string | null;
} & ValidatedPreset;

type Callback = () => void;

export function getRsyncFunc({
    src,
    dest,
    exclude,
    include,
    parseOutput,
    filterFilePath,
}: Param): {
    command: () => string;
    execute: (cb: Callback) => void;
} {
    const rsync = new RsyncPkg()
        .shell('ssh')
        .flags('az')
        .source(src)
        .set('progress')
        .destination(dest)
        .exclude(exclude)
        .include(include)
        .output(parseOutput ? onStdout : writeToStdout, onError);

    if (filterFilePath && fs.existsSync(filterFilePath)) {
        rsync.set('filter', `merge ${filterFilePath}`);
    }

    return rsync;
}
