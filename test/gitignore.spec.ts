import fs from 'node:fs';
import path from 'node:path';
import dirTree from 'directory-tree';

import {syndProcess} from '../src/syndProcess';

/* eslint-disable */
jest.mock('../src/utils/log', () => () => {});
/* eslint-enable */

const syndConfig = {
    gitignore: {
        src: `${path.resolve('./test/suits/gitignore/src')}/`,
        dest: path.resolve('./test/suits/gitignore/dest'),
        localGitignore: true,
        initSync: true,
        watch: false,
    },
};

function normalizePaths(
    tree: dirTree.DirectoryTree,
    dirName: string,
): dirTree.DirectoryTree {
    const result = {
        ...tree,
        path: tree.path
            .replace('test/suits/gitignore/src', '')
            .replace('test/suits/gitignore/dest', ''),
    };
    if ('children' in tree && tree.children !== undefined)
        result.children = tree.children.map(x => normalizePaths(x, dirName));
    return result;
}

function getAllPaths(tree: dirTree.DirectoryTree): string[] {
    const paths: string[] = [];
    function pushToTree(obj: dirTree.DirectoryTree): void {
        if (obj.type === 'file') paths.push(obj.path);
        if ('children' in obj && obj.children !== undefined) {
            for (const child of obj.children) {
                pushToTree(child);
            }
        }
    }
    if (tree.children !== undefined) tree.children.forEach(pushToTree);
    return paths;
}

beforeEach(() => {
    const destPath = './test/suits/gitignore/dest';
    if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
    const files = fs.readdirSync(destPath) || [];

    for (const file of files) {
        fs.rmSync(path.resolve(destPath, file), {recursive: true, force: true});
    }
});

// eslint-disable-next-line
const execSynd = async (timeout = 1000) => {
    syndProcess(syndConfig, 'gitignore');

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(undefined);
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
