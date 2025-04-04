import fs from 'node:fs';
import cp from 'node:child_process';

import {onStdout} from './stdout';
import {log} from '../utils';

import type {ValidatedPreset} from '../types';

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

type Callback = (msg: string | null) => void;

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
    const args: string[] = [];

    // Set the remote shell to ssh
    args.push('-e', 'ssh');

    // Set flags archive and compress
    args.push('-a', '-z');

    // Set the output format to list only file names
    args.push('--out-format=%n');

    // If filter file exists, add filter option
    if (filterFilePath && fs.existsSync(filterFilePath)) {
        // args.push(`--filter="merge ${filterFilePath}"`);
        args.push(`--filter='merge ${filterFilePath}'`);
    }

    // Add exclude patterns if provided
    if (exclude) {
        if (Array.isArray(exclude)) {
            args.push(...exclude.map(pattern => `--exclude=${pattern}`));
        } else {
            args.push(`--exclude=${exclude}`);
        }
    }

    // Add include patterns if provided
    if (include) {
        if (Array.isArray(include)) {
            args.push(...include.map(pattern => `--include=${pattern}`));
        } else {
            args.push(`--include=${include}`);
        }
    }

    // Append source and destination paths at the end
    args.push(src, dest);

    const cmd = `rsync ${args.join(' ')}`;

    return {
        // Return the complete command as a string (useful for logging or debugging)
        command: () => cmd,
        // Execute the command by spawning a child process
        execute: (cb: Callback) => {
            const child = cp.spawn('/bin/sh', ['-c', cmd], {
                stdio: 'pipe',
                cwd: process.cwd(),
                env: process.env,
            });

            child.stdout.on('data', parseOutput ? onStdout : writeToStdout);

            child.stderr.on('data', onError);

            child.on('close', code => {
                if (code !== 0) {
                    return cb(`rsync process exited with code ${code}`);
                }
                return cb(null);
            });

            child.on('error', err => {
                cb(err.message);
            });
        },
    };
}
