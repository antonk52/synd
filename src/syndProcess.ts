import fs, {type WatchEventType} from 'node:fs';
import process from 'node:process';
import debounce from 'lodash.debounce';
import {getRsyncFunc} from './getRsyncFunc';
import {getConfig, getFilterFile, getPaths, parseConfig, log} from './utils';
import {styleText} from 'node:util';

type Options = {
    list?: boolean;
};

export const syndProcess = (name: string | void, cmd: Options): void => {
    const syndConfig = getConfig();

    if (cmd.list === true) {
        log.plain('Your presets:');
        log.plain(
            Object.keys(syndConfig)
                .map(k => `- ${k}`)
                .join('\n'),
        );

        process.exit(0);
    }

    if (name === undefined) {
        log(
            `Preset name is missing, exiting. Run "synd <preset-name>". Exiting`,
        );
        process.exit(0);
    }

    log(`Going to try to do the "${name}" preset`);

    /**
     * validated preset with defaults
     */
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

    const logDoneUploading = (): void => {
        log(styleText('green', 'done'));
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
