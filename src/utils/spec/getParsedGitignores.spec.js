const getParsedGitignores = require('../getParsedGitignores');

jest.mock('parse-gitignore', () => jest.fn());
jest.mock('fs', () => ({
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
}));

describe('getParsedGitignores', () => {
    it('should return an empty array when both settings are false', () => {
        const result = getParsedGitignores({
            localGitignore: false,
            globalGitignore: false,
        });
        const expected = [];

        expect(result).toEqual(expected);
    });

    it('should return the same result as returned from `parse-gitignore` function', () => {
        const pgMock = require('parse-gitignore');
        pgMock.mockImplementation(() => ['a', '!b']);
        const fsMock = require('fs');
        fsMock.existsSync.mockImplementation(() => true);
        fsMock.readFileSync.mockImplementation(() => '');

        const result = getParsedGitignores({
            localGitignore: true,
            globalGitignore: false,
            src: 'valid/path',
        });
        const expected = ['a', '!b'];

        expect(result).toEqual(expected);
    });

    it('should return concatenated array of results returned from `parse-gitignore` function', () => {
        const pgMock = require('parse-gitignore');
        pgMock.mockImplementationOnce(() => ['a', '!b']);
        pgMock.mockImplementationOnce(() => ['c', '!d']);
        const fsMock = require('fs');
        fsMock.existsSync.mockImplementation(() => true);
        fsMock.readFileSync.mockImplementation(() => '');

        const result = getParsedGitignores({
            localGitignore: true,
            globalGitignore: true,
            src: 'valid/path',
        });
        const expected = ['a', '!b', 'c', '!d'];

        expect(result).toEqual(expected);
    });

    it('should return an empty array when .gitignore files do not exist', () => {
        const fsMock = require('fs');
        fsMock.existsSync.mockImplementation(() => false);

        const result = getParsedGitignores({
            localGitignore: true,
            globalGitignore: true,
            src: 'valid/path',
        });
        const expected = [];

        expect(result).toEqual(expected);
    });
});
