const fs = require('fs');
const path = require('path');

const md5 = require('md5');

const getHomeDir = require('./getHomeDir');
const log = require('./log');

const getFilterFile = ({include, exclude, name}) => {
    const content = [
        exclude.map(rule => `- ${rule}`).join('\n'),
        include.map(rule => `+ ${rule}`).join('\n'),
    ].join('\n');

    const hash = md5(content);

    const filterDirPath = path.resolve(getHomeDir(), '.synd');

    if (!fs.existsSync(filterDirPath)) {
        log('.synd dir not present, so let\'s create it');
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
