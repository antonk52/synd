const getParsedGitignores = require('./getParsedGitignores');

const startsWithBang = str => str.startsWith('!');
const removeStartBang = str => str.replace(/^!/, '');

const getPaths = config => {
    const parsedPaths = getParsedGitignores(config);
    const syndInclude = parsedPaths
        .filter(startsWithBang)
        .map(removeStartBang);
    const syndExclude = parsedPaths.filter(s => !startsWithBang(s));

    return {
        ...config,
        syndExclude,
        syndInclude,
    };
};

module.exports = getPaths;
