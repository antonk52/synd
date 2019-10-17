const fs = require('fs');
const getRsyncFunc = require('./rsync');
const {
    getOnFileChangeFunc,
    getSyncFunc,
    getConfig,
    getFilterFile,
    getPaths,
    parseConfig,
    log,
} = require('./utils');

const syndProcess = (name, cmd) => {
    const syndConfig = getConfig();

    if (cmd.list === true) {
        log.plain(`Your presets:`);
        log.plain(
            Object.keys(syndConfig)
                .map(k => `- ${k}`)
                .join('\n'),
        );
    }

    if (name === undefined) return null;

    log(`Going to try to do the "${name}" preset`);

    const userConfig = parseConfig(syndConfig, name);
    const userConfigWithFullIncludeExclude = getPaths(userConfig);
    const filterFilePath = getFilterFile(userConfigWithFullIncludeExclude);

    log(`about to sync \n\t${userConfig.src} to \n\t${userConfig.dest}\n\n`);

    const rsyncFunc = getRsyncFunc({
        ...userConfigWithFullIncludeExclude,
        filterFilePath,
    });

    if (userConfig.showRsyncCommand)
        log(`rsync command\n\n${rsyncFunc.command()}`);

    const syncFunc = getSyncFunc({rsyncFunc});
    const onFileChangeFunc = getOnFileChangeFunc({syncFunc});

    if (userConfig.watch) {
        fs.watch(userConfig.src, {recursive: true}, onFileChangeFunc);
    }

    if (userConfig.initSync === true) syncFunc();

    return {
        ...userConfigWithFullIncludeExclude,
        filterFilePath,
        rsyncFunc,
        syncFunc,
        onFileChangeFunc,
    };
};

module.exports = syndProcess;
