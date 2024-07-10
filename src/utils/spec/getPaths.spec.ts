import {vi, describe, it, expect} from 'vitest';
import {getPaths} from '../getPaths';

vi.mock('../getParsedGitignores', () => ({getParsedGitignores: vi.fn()}));

describe('getPaths', () => {
    const commonParams = {
        localGitignore: false,
        globalGitignore: false,
        src: 'valid/path',
    };
    it('should return values from gitignore files', async () => {
        const {getParsedGitignores} = await import('../getParsedGitignores');
        (getParsedGitignores as any).mockImplementation(() => [
            '!path/to/include',
            'path/to/ignore',
        ]);

        const result = getPaths({...commonParams, include: [], exclude: []});
        const expected = {
            include: ['path/to/include'],
            exclude: ['path/to/ignore'],
        };

        expect(result).toEqual(expected);
    });

    it('should return values from user preset', async () => {
        const {getParsedGitignores} = await import('../getParsedGitignores');
        (getParsedGitignores as any).mockImplementation(() => []);

        const result = getPaths({
            ...commonParams,
            include: ['include/path'],
            exclude: ['exclude/path'],
        });
        const expected = {
            include: ['include/path'],
            exclude: ['exclude/path'],
        };

        expect(result).toEqual(expected);
    });

    it('should return mixin values from gitignore files and user preset', async () => {
        const {getParsedGitignores} = await import('../getParsedGitignores');
        (getParsedGitignores as any).mockImplementation(() => [
            '!include/from/gitignores',
            'exclude/from/gitignores',
        ]);

        const result = getPaths({
            ...commonParams,
            include: ['had/include'],
            exclude: ['had/exclude'],
        });
        const expected = {
            include: ['had/include', 'include/from/gitignores'],
            exclude: ['had/exclude', 'exclude/from/gitignores'],
        };

        expect(result).toEqual(expected);
    });
});
