import {vi, describe, it, expect} from 'vitest';
import {getFilterFile, getFilterDirPath} from '../getFilterFile';

vi.mock('path', () => ({
    default: {
        resolve: (a: string, b: string): string => [a, b].join('/'),
        join: (...strs: string[]): string => strs.join('/'),
    },
}));
vi.mock('../getMd5Hash', () => ({getMd5Hash: (): string => 'HASH'}));
vi.mock('../../../package.json', () => ({version: 'VERSION'}));
vi.mock('os', () => ({
    default: {
        homedir: (): string => 'HOMEDIR',
    },
}));
// eslint-disable-next-line
vi.mock('../log', () => ({default: () => {}}));
vi.mock('fs', () => ({
    default: {
        existsSync: vi.fn(),
        mkdirSync: vi.fn(),
        writeFileSync: vi.fn(),
    },
}));
vi.mock('process', () => ({default: {env: {}}}));

describe('getFilterDirPath', () => {
    // needs to refactro runtime require to import()
    it.skip('XDG PATH', () => {
        const result = getFilterDirPath({
            env: {XDG_CACHE_HOME: 'XDG_CACHE_HOME'},
        } as any as NodeJS.Process);

        expect(result).toEqual('XDG_CACHE_HOME/synd/VERSION');
    });

    // needs to refactro runtime require to import()
    it.skip('cache home dir', async () => {
        const fsMock = await import('fs');
        (fsMock.default.existsSync as any).mockReturnValueOnce(true);
        const result = getFilterDirPath({
            env: {},
        } as any as NodeJS.Process);

        expect(result).toEqual('HOMEDIR/.cache/synd/VERSION');
    });

    it('home dir', async () => {
        const fsMock = await import('fs');
        (fsMock.default.existsSync as any).mockReturnValueOnce(false);
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

    it('should call fs.writeFileSync with given params', async () => {
        const fsMock = await import('fs');
        const result = getFilterFile({
            include: ['a', 'b'],
            exclude: ['c', 'd'],
            name: 'PRESET_NAME',
        });
        const expected = 'HOMEDIR/.synd/PRESET_NAME.HASH.filter';

        expect(result).toEqual(expected);
        expect((fsMock.default.writeFileSync as any).mock.calls.length).toEqual(
            1,
        );
        expect((fsMock.default.writeFileSync as any).mock.calls[0][0]).toEqual(
            expected,
        );
        expect((fsMock.default.writeFileSync as any).mock.calls[0][1]).toEqual(
            '- c\n- d\n+ a\n+ b',
        );
    });
});
