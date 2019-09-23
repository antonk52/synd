const fs = require('fs');
const path = require('path');
const Rsync = require('rsync');

const stdout = require('./stdout');
const stderr = require('./stderr');
const writeToStdout = require('./writeToStdout');

const rsync = ({
    src,
    dest,
    exclude = [],
    include = [],
    rsyncFilter,
    parseOutput = true,
    filterFilePath,
}) => {
    const rsyncFunc = new Rsync()
        .shell('ssh')
        .flags('az')
        .source(src)
        .set('progress')
        .destination(dest)
        .exclude(exclude)
        .include(include)
        .output(parseOutput ? stdout : writeToStdout, stderr);

    if (rsyncFilter && fs.existsSync(path.resolve(src, rsyncFilter))) {
        rsyncFunc.set('filter', `merge ${path.resolve(src, rsyncFilter)}`);
    }

    if (filterFilePath && fs.existsSync(filterFilePath)) {
        rsyncFunc.set('filter', `merge ${filterFilePath}`);
    }

    return rsyncFunc;
};

module.exports = rsync;
