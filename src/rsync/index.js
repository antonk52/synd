const fs = require('fs');
const path = require('path');
const process = require('process');
const Rsync = require('rsync');

const stdout = require('./stdout');
const stderr = require('./stderr');
const writeToStdout = require('./writeToStdout');

const rsync = obj => {
    const {
        src,
        dest,
        exclude = [],
        include = [],
        rsyncFilter,
        parseOutput = true,
        filterFilePath,
    } = obj;

    const theThing = new Rsync()
        .shell('ssh')
        .flags('az')
        .source(src)
        .set('progress')
        .destination(dest)
        .exclude(exclude)
        .include(include)
        .output(
            parseOutput ? stdout : writeToStdout,
            stderr,
        );

    if (rsyncFilter && fs.existsSync(path.resolve(src, rsyncFilter))) {
        theThing.set('filter', `merge ${path.resolve(src, rsyncFilter)}`);
    }

    if (filterFilePath && fs.existsSync(filterFilePath)) {
        theThing.set('filter', `merge ${filterFilePath}`);
    }

    return {
        ...obj,
        rsyncFunc: theThing,
    };
};

module.exports = rsync;
