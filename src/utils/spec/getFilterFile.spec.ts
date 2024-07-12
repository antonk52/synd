import {getFilterFile, getFilterDirPath} from '../getFilterFile';
import fs from 'node:fs';

jest.mock('node:path', () => ({
    resolve: (a: string, b: string): string => [a, b].join('/'),
    join: (...strs: string[]): string => strs.join('/'),
}));
jest.mock('../getMd5Hash', () => ({getMd5Hash: (): string => 'HASH'}));
jest.mock('../../../package.json', () => ({version: 'VERSION'}));
jest.mock('node:os', () => ({homedir: (): string => 'HOMEDIR'}));
// eslint-disable-next-line
jest.mock('../log', () => (): void => {});
jest.mock('node:fs', () => ({
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    writeFileSync: jest.fn(),
}));
jest.mock('node:process', () => ({env: {}}));

describe('getFilterDirPath', () => {
    it('XDG PATH', () => {
        const result = getFilterDirPath({
            env: {XDG_CACHE_HOME: 'XDG_CACHE_HOME'},
        } as any as NodeJS.Process);

        expect(result).toEqual('XDG_CACHE_HOME/synd/VERSION');
    });

    it('cache home dir', () => {
        (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
        const result = getFilterDirPath({
            env: {},
        } as any as NodeJS.Process);

        expect(result).toEqual('HOMEDIR/.cache/synd/VERSION');
    });

    it('home dir', () => {
        (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
        const result = getFilterDirPath({env: {}} as any);

        expect(result).toEqual('HOMEDIR/.synd');
    });
});

describe('getFilterFile', () => {
    it('should return null when include and exclude are empty arrays', () => {
        const result = getFilterFile({name: 'foo', include: [], exclude: []});
        const expected = null;

        expect(result).toEqual(expected);
    });

    it('should call fs.writeFileSync with given params', () => {
        const fsMock = require('node:fs');
        const result = getFilterFile({
            include: ['a', 'b'],
            exclude: ['c', 'd'],
            name: 'PRESET_NAME',
        });
        const expected = 'HOMEDIR/.synd/PRESET_NAME.HASH.filter';

        expect(result).toEqual(expected);
        expect(fsMock.writeFileSync.mock.calls.length).toEqual(1);
        expect(fsMock.writeFileSync.mock.calls[0][0]).toEqual(expected);
        expect(fsMock.writeFileSync.mock.calls[0][1]).toEqual(
            '- c\n- d\n+ a\n+ b',
        );
    });
});
