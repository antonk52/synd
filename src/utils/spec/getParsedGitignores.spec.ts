import {getParsedGitignores} from '../getParsedGitignores';

jest.mock('fs', () => ({
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
}));

describe('getParsedGitignores', () => {
    it('should return an empty array when both settings are false', () => {
        const result = getParsedGitignores({
            src: 'some/path',
            localGitignore: false,
            globalGitignore: false,
        });
        const expected: string[] = [];

        expect(result).toEqual(expected);
    });

    it('should return filter out comments and empty lines', () => {
        const fsMock = require('node:fs');
        fsMock.existsSync.mockImplementation(() => true);
        fsMock.readFileSync.mockImplementation(() =>
            ['# comment', '', 'a', '!b'].join('\n'),
        );

        const result = getParsedGitignores({
            localGitignore: true,
            globalGitignore: false,
            src: 'valid/path',
        });
        const expected = ['a', '!b'];

        expect(result).toEqual(expected);
    });

    it('should return concatenated array of results returned from `parse-gitignore` function', () => {
        const fsMock = require('node:fs');
        fsMock.existsSync.mockImplementation(() => true);
        fsMock.readFileSync.mockImplementationOnce(() =>
            ['a', '!b'].join('\n'),
        );
        fsMock.readFileSync.mockImplementationOnce(() =>
            ['c', '!d'].join('\n'),
        );

        const result = getParsedGitignores({
            localGitignore: true,
            globalGitignore: true,
            src: 'valid/path',
        });
        const expected = ['a', '!b', 'c', '!d'];

        expect(result).toEqual(expected);
    });

    it('should return an empty array when .gitignore files do not exist', () => {
        const fsMock = require('node:fs');
        fsMock.existsSync.mockImplementation(() => false);

        const result = getParsedGitignores({
            localGitignore: true,
            globalGitignore: true,
            src: 'valid/path',
        });
        const expected: string[] = [];

        expect(result).toEqual(expected);
    });
});
