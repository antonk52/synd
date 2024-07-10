import {vi, describe, it, expect} from 'vitest';
import {getParsedGitignores} from '../getParsedGitignores';

vi.mock('fs', () => ({
    default: {
        existsSync: vi.fn(),
        readFileSync: vi.fn(),
    },
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

    it('should return filter out comments and empty lines', async () => {
        const fsMock = await import('fs');
        (fsMock.default.existsSync as any).mockImplementation(() => true);
        (fsMock.default.readFileSync as any).mockImplementation(() =>
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

    it('should return concatenated array of results returned from `parse-gitignore` function', async () => {
        const fsMock = await import('fs');
        (fsMock.default.existsSync as any).mockImplementation(() => true);
        (fsMock.default.readFileSync as any).mockImplementationOnce(() =>
            ['a', '!b'].join('\n'),
        );
        (fsMock.default.readFileSync as any).mockImplementationOnce(() =>
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

    it('should return an empty array when .gitignore files do not exist', async () => {
        const fsMock = await import('fs');
        (fsMock.default.existsSync as any).mockImplementation(() => false);

        const result = getParsedGitignores({
            localGitignore: true,
            globalGitignore: true,
            src: 'valid/path',
        });
        const expected: string[] = [];

        expect(result).toEqual(expected);
    });
});
