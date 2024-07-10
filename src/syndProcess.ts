import fs from 'fs';
import kleur from 'kleur';
import process from 'process';
import debounce from 'lodash.debounce';
import {getRsyncFunc} from './getRsyncFunc';
import {getConfig, getFilterFile, getPaths, parseConfig, log} from './utils';

type Options = {
    list?: boolean;
};

export const syndProcess = (name: string | void, cmd: Options): void => {
    console.log(0, {getConfigCalls: getConfig.mock.calls});
    const syndConfig = getConfig();

    console.log(1, {getConfigCalls: getConfig.mock.calls, syndConfig});

    if (cmd.list === true) {
        log.plain(`Your presets:`);
        log.plain(
            Object.keys(syndConfig)
                .map(k => `- ${k}`)
                .join('\n'),
        );

        process.exit(0);
    }
    console.log(2);

    if (name === undefined) {
        log(
            `Preset name is missing, exiting. Run "synd <preset-name>". Exiting`,
        );
        process.exit(0);
    }
    console.log(3, {syndConfig});

    log(`Going to try to do the "${name}" preset`);

    /**
     * validated preset with defaults
     */
    const userConfig = parseConfig(syndConfig, name);
    console.log(3.11, {parseConfig, mock: parseConfig.mock.calls});
    const {include, exclude} = getPaths(userConfig);
    console.log(3.2, userConfig);
    const filterFilePath = getFilterFile({
        name: userConfig?.name,
        include,
        exclude,
    });
    console.log(3.3);

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
        log(`${kleur.green('done')}`);
    };
    const syncUp = debounce(() => syncCommand.execute(logDoneUploading), 100);

    if (userConfig.watch) {
        function onFileChange(eventType: string, filename: string): void {
            log(`${kleur.yellow(eventType)} ${filename}`);
            syncUp();
        }
        fs.watch(userConfig.src, {recursive: true}, onFileChange);
    }

    if (userConfig.initSync === true) syncUp();
};
