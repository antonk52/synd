const getParsedGitignores = require('./getParsedGitignores');

const startsWithBang = str => str.startsWith('!');
const removeStartBang = str => str.replace(/^!/, '');

const getPaths = config => {
    const parsedPaths = getParsedGitignores(config);
    const syndInclude = parsedPaths.filter(startsWithBang).map(removeStartBang);
    const syndExclude = parsedPaths.filter(s => !startsWithBang(s));

    // mixin rules from gitignores
    return {
        ...config,
        include: config.include.concat(syndInclude),
        exclude: config.exclude.concat(syndExclude),
    };
};

module.exports = getPaths;
