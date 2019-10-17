const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const dirTree = require('directory-tree');

const syndProcess = require('../src/syndProcess');

jest.mock('../src/utils/log', () => () => {});
jest.mock('../src/rsync/writeToStdout', () => () => {});
jest.mock('../src/rsync/stdout', () => () => {});

function normalizePaths(tree, dirName) {
    const result = {
        ...tree,
        path: tree.path
            .replace(`test/suits/gitignore/src`, '')
            .replace(`test/suits/gitignore/dest`, ''),
    };
    if ('children' in tree)
        result.children = tree.children.map(x => normalizePaths(x, dirName));
    return result;
}

function getAllPaths(tree) {
    const paths = [];
    function pushToTree(obj) {
        if (obj.type === 'file') paths.push(obj.path);
        if ('children' in obj) obj.children.forEach(o => pushToTree(o));
    }
    tree.children.forEach(pushToTree);
    return paths;
}

beforeEach(() => {
    const destPath = './test/suits/gitignore/dest';
    if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
    const files = fs.readdirSync(destPath) || [];

    files.forEach(x => rimraf.sync(path.resolve(destPath, x)));
});

jest.mock(`../src/utils/getConfig`, () => {
    const pathl = require('path');
    const src = `${pathl.resolve('./test/suits/gitignore/src')}/`;
    const dest = pathl.resolve('./test/suits/gitignore/dest');

    return () => ({
        gitignore: {
            src,
            dest,
            localGitignore: true,
            initSync: true,
            watch: false,
        },
    });
});

const execSynd = async (timeout = 1000) => {
    syndProcess('gitignore', {});

    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
};

describe('local gitignore', () => {
    it('should sync avoiding git ignored files', async () => {
        const srcPaths = getAllPaths(
            normalizePaths(dirTree('./test/suits/gitignore/src'), 'gitignore'),
        );
        const destPrePaths = getAllPaths(
            normalizePaths(dirTree('./test/suits/gitignore/dest'), 'gitignore'),
        );
        // initially dest dir should be empty
        expect(destPrePaths).toEqual([]);

        await execSynd();
        const destPaths = getAllPaths(
            normalizePaths(dirTree('./test/suits/gitignore/dest'), 'gitignore'),
        );

        const srcNewPaths = getAllPaths(
            normalizePaths(dirTree('./test/suits/gitignore/src'), 'gitignore'),
        );

        // src content did not change
        expect(srcNewPaths).toEqual(srcPaths);

        const srcNoMarkdown = srcPaths.filter(x => !x.endsWith('.md'));
        return expect(destPaths).toEqual(srcNoMarkdown);
    });
});
