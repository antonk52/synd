import fs from 'node:fs';
import path from 'node:path';
import dirTree from 'directory-tree';
import {syndProcess} from '../src/syndProcess';

/* eslint-disable */
// jest.mock('../src/utils/log', () =>
//     Object.assign((): void => {}, {
//         errorAndExit: (msg: string) => {
//             throw new Error(msg);
//         },
//     }),
// );
/* eslint-enable */

const syndConfig = {
    basic: {
        src: `${path.resolve('./test/suits/basic/src')}/`,
        dest: path.resolve('./test/suits/basic/dest'),
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
            .replace('test/suits/basic/src', '')
            .replace('test/suits/basic/dest', ''),
    };
    if ('children' in tree && tree.children !== undefined)
        result.children = tree.children.map(x => normalizePaths(x, dirName));
    return result;
}

beforeEach(() => {
    const destPath = './test/suits/basic/dest';
    if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
    const files = fs.readdirSync(destPath) || [];

    for (const file of files) {
        fs.rmSync(path.resolve(destPath, file), {force: true, recursive: true});
    }
});

describe('directories syncing', () => {
    const execSynd = async ({
        preset,
        timeout = 1000,
    }: {
        preset: string;
        timeout?: number;
    }): Promise<void> => {
        syndProcess(syndConfig, preset);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(undefined);
            }, timeout);
        });
    };

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
