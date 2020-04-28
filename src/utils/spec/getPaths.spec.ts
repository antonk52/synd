import {getPaths} from '../getPaths';

jest.mock('../getParsedGitignores', () => ({getParsedGitignores: jest.fn()}));

describe('getPaths', () => {
    const commonParams = {
        localGitignore: false,
        globalGitignore: false,
        src: 'valid/path',
    };
    it('should return values from gitignore files', () => {
        const {getParsedGitignores} = require('../getParsedGitignores');
        getParsedGitignores.mockImplementation(() => [
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

    it('should return values from user preset', () => {
        const {getParsedGitignores} = require('../getParsedGitignores');
        getParsedGitignores.mockImplementation(() => []);

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

    it('should return mixin values from gitignore files and user preset', () => {
        const {getParsedGitignores} = require('../getParsedGitignores');
        getParsedGitignores.mockImplementation(() => [
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
