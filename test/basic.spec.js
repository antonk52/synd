const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const dirTree = require('directory-tree');

const syndProcess = require('../src/utils/syndProcess');

function normalizePaths(tree, dirName) {
    tree.path = tree.path
        .replace(`test/suits/basic/src`, '')
        .replace(`test/suits/basic/dest`, '');
    if ('children' in tree)
        tree.children = tree.children.map(x => normalizePaths(x, dirName));
    return tree;
}

beforeEach(() => {
    const destPath = './test/suits/basic/dest';
    if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
    const files = fs.readdirSync(destPath) || [];

    files.forEach(x => rimraf.sync(path.resolve(destPath, x)));
});

jest.mock(`../src/utils/getPresetConfig`, () => {
    const path = require('path');
    const src = path.resolve('./test/suits/basic/src') + '/';
    const dest = path.resolve('./test/suits/basic/dest');

    return () => ({
        src,
        dest,
        include: [],
        exclude: [],
        initSync: true,
        watch: false,
    });
});

const execSynd = async ({preset, timeout = 1000}) => {
    syndProcess(preset)

    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
};

describe('directories syncing', () => {
    it('basic', async () => {
        const {children: srcContent} = normalizePaths(
            dirTree('./test/suits/basic/src'),
            'basic',
        );
        const {children: destPreContent} = normalizePaths(
            dirTree('./test/suits/basic/dest'),
            'basic',
        );
        // initially dest dir should be empty
        expect(destPreContent).toEqual([]);

        await execSynd({preset: 'basic'});
        const {children: destContent} = normalizePaths(
            dirTree('./test/suits/basic/dest'),
            'basic',
        );

        const {children: newSrcContent} = normalizePaths(
            dirTree('./test/suits/basic/src'),
            'basic',
        );

        // src content did not change
        expect(newSrcContent).toEqual(srcContent);
        return expect(destContent).toEqual(srcContent);
    });
});