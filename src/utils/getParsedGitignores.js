const fs = require('fs');
const path = require('path');

const parseGitignore = require('parse-gitignore');

const getHomeDir = require('./getHomeDir');

// TODO: log warning when gitignore does not exist
const getParsedGitignores = ({src, localGitignore, globalGitignore}) => {
    let localGitignoreContent = [];
    if (localGitignore) {
        const localGitignorePath = path.join(src, '.gitignore');
        localGitignoreContent = fs.existsSync(localGitignorePath)
            ? parseGitignore(fs.readFileSync(localGitignorePath))
            : [];
    }

    let globalGitignoreContent = [];
    if (globalGitignore) {
        const globalGitignorePath = path.join(getHomeDir(), '.gitignore');
        globalGitignoreContent = fs.existsSync(globalGitignorePath)
            ? parseGitignore(fs.readFileSync(globalGitignorePath))
            : [];
    }

    return [
        ...localGitignoreContent,
        ...globalGitignoreContent,
    ];
};

module.exports = getParsedGitignores;
