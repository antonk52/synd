'use strict';

const getRsyncFunc = require('./rsync');
const {
    getOnFileChangeFunc,
    getSyncFunc,
    getFilterFile,
    getPaths,
    parseConfig,
    log,
} = require('./utils');

const syndProcess = name => {
    log(`Going to try to do the "${name}" preset`);

    const userConfig = parseConfig(name);
    const userConfigWithFullIncludeExclude = getPaths(userConfig);
    const filterFilePath = getFilterFile(userConfigWithFullIncludeExclude);

    log(`about to sync \n\t${userConfig.src} to \n\t${userConfig.dest}\n\n`);

    const rsyncFunc = getRsyncFunc({
        ...userConfigWithFullIncludeExclude,
        filterFilePath,
    });

    if (userConfig.showRsyncCommand) log(`rsync command\n\n${rsyncFunc.command()}`);

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
