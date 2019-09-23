'use strict'

const getPaths = require('../getPaths');

jest.mock('../getParsedGitignores', () => jest.fn());

describe('getPaths', () => {
    it('should return mixin values to include and exclude', () => {
        const getParsedGitignoresMock = require('../getParsedGitignores');
        getParsedGitignoresMock.mockImplementation(() => ['!path/to/include', 'path/to/ignore'])

        const result = getPaths({include: [], exclude: []});
        const expected = {
            include: ['path/to/include'],
            exclude: ['path/to/ignore'],
        };

        expect(result).toEqual(expected);
    });

    it('should return mixin correct values to include and exclude', () => {
        const getParsedGitignoresMock = require('../getParsedGitignores');
        getParsedGitignoresMock.mockImplementation(() => [])

        const result = getPaths({include: ['include/path'], exclude: ['exclude/path']});
        const expected = {
            include: ['include/path'],
            exclude: ['exclude/path'],
        };

        expect(result).toEqual(expected);
    });

    it('should return mixin values to include and exclude from gitignores', () => {
        const getParsedGitignoresMock = require('../getParsedGitignores');
        getParsedGitignoresMock.mockImplementation(() => ['!include/from/gitignores', 'exclude/from/gitignores'])

        const result = getPaths({include: ['had/include'], exclude: ['had/exclude']});
        const expected = {
            include: ['had/include', 'include/from/gitignores'],
            exclude: ['had/exclude', 'exclude/from/gitignores'],
        };

        expect(result).toEqual(expected);
    });
});
