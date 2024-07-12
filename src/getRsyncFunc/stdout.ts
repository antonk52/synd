import kleur from 'kleur';

import {log} from '../utils';

export function onStdout(buffer: Buffer): void {
    // break the buffer into an array of strings
    const output = `${buffer}`
        .trim()
        .replace('/{2,}/g', '\n')
        .replace('/\t{1,}/g', '\n')
        .split('\n');

    // eliminate upload info
    const files = output.filter(f => !(f === '' || f === './'));

    for (const name of files) {
        log(`${kleur.yellow('uploading')}  ${name}`);
    }
}
