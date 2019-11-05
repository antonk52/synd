const fs = require('fs');
const path = require('path');

const getHomeDir = require('./getHomeDir');
const log = require('./log');
const getMd5Hash = require('./getMd5Hash');

const getFilterFile = ({include, exclude, name}) => {
    if (include.length === 0 && exclude.length === 0) {
        return null;
    }
    const content = [
        exclude.map(rule => `- ${rule}`).join('\n'),
        include.map(rule => `+ ${rule}`).join('\n'),
    ].join('\n');

    const hash = getMd5Hash(content);

    const filterDirPath = path.resolve(getHomeDir(), '.synd');

    if (!fs.existsSync(filterDirPath)) {
        log(".synd dir not present, so let's create it");
        fs.mkdirSync(filterDirPath);
    }

    const filterFileName = `${name}.${hash}.filter`;

    const filterFilePath = path.resolve(filterDirPath, filterFileName);

    if (!fs.existsSync(filterFilePath)) {
        log(`filter file not preset, creating ${filterFilePath}`);

        fs.writeFileSync(filterFilePath, content);
    } else {
        log('found filter file, using it', filterFilePath);
    }

    return filterFilePath;
};

module.exports = getFilterFile;
