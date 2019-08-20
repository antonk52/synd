const fs = require('fs');
const path = require('path');

const parseGitignore = require('parse-gitignore');

const getHomeDir = require('./getHomeDir');

const getParsedGitignores = ({src, localGitignore, globalGitignore}) => {
    let localGitignoreContent = [];
    if (localGitignore) {
        const localGitignorePath = path.join(src, '.gitignore');
        localGitignoreContent = [
            ...(
                fs.existsSync(localGitignorePath)
                    ? parseGitignore(localGitignorePath)
                    : []
            ),
        ];
    }

    let globalGitignoreContent = [];
    if (globalGitignore) {
        const globalGitignorePath = path.join(getHomeDir(), '.gitignore');
        globalGitignoreContent = [
            ...(
                fs.existsSync(globalGitignorePath)
                    ? parseGitignore(globalGitignorePath)
                    : []
            ),
        ];
    }

    return [
        ...localGitignoreContent,
        ...globalGitignoreContent,
    ];
};

module.exports = getParsedGitignores;
