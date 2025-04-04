import fs, {type WatchEventType} from 'node:fs';
import {getRsyncFunc} from './getRsyncFunc';
import {getFilterFile, getPaths, parseConfig, log} from './utils';
import {styleText} from 'node:util';
import type {SyndConfig} from './types';
import {debounce} from './debounce';

export const syndProcess = (syndConfig: SyndConfig, name: string): void => {
    /** validated preset with defaults */
    const userConfig = parseConfig(syndConfig, name);
    const {include, exclude} = getPaths(userConfig);
    const filterFilePath = getFilterFile({
        name: userConfig.name,
        include,
        exclude,
    });

    log(`about to sync \n\t${userConfig.src} to \n\t${userConfig.dest}\n\n`);

    const syncCommand = getRsyncFunc({
        ...userConfig,
        include,
        exclude,
        filterFilePath,
    });

    if (userConfig.showRsyncCommand) {
        log(`rsync command\n\n${syncCommand.command()}`);
    }

    const logDoneUploading = (msg: string | null): void => {
        if (msg) {
            log(styleText('red', msg));
        } else {
            log(styleText('green', 'done'));
        }
    };
    const syncUp = debounce(() => syncCommand.execute(logDoneUploading), 100);

    if (userConfig.watch) {
        function onFileChange<T>(eventType: WatchEventType, filename: T): void {
            log(`${styleText('yellow', eventType)} ${filename}`);
            syncUp();
        }
        fs.watch(userConfig.src, {recursive: true}, onFileChange);
    }

    if (userConfig.initSync === true) syncUp();
};
