const getPresetConfig = require('../getPresetConfig');

jest.mock('../log', () => ({errorAndExit: jest.fn()}));
jest.mock('../getHomeDir', () => jest.fn()
    .mockImplementationOnce(() => 'non/existing/path')
    .mockImplementation(() => 'src/utils/spec')
);
// has to be a valid path, so jest wont complain
jest.mock('./.synd.config.js', () => ({
    lol: {
        src: 'from here',
        dest: 'to here',
    },
}));

beforeEach(() => {
    const logMock = require('../log');
    logMock.errorAndExit.mockClear();
});

describe('getPresetConfig', () => {
    it('should log error when config does not exist', () => {
        const logMock = require('../log');
        const result = getPresetConfig('lol');

        expect(result).toEqual(undefined);
        expect(logMock.errorAndExit.mock.calls.length).toBe(1);
        expect(logMock.errorAndExit.mock.calls[0][0]).toBe(
            '~/.synd.config.js does not exist',
        );
    });

    it('should return a valid preset by name', () => {
        const logMock = require('../log');
        const result = getPresetConfig('lol');
        const expected = {
            src: 'from here',
            dest: 'to here',
        };

        expect(result).toEqual(expected);
        expect(logMock.errorAndExit.mock.calls.length).toBe(0);
    });

    it('should error and exit when preset does not exist', () => {
        const logMock = require('../log');
        const result = getPresetConfig('PRESET_NAME');

        expect(result).toEqual(undefined);
        expect(logMock.errorAndExit.mock.calls.length).toBe(1);
        expect(logMock.errorAndExit.mock.calls[0][0]).toBe(
            'PRESET_NAME is not in your .synd.config.js file',
        );
    });

    it('should log error when config is invalid', () => {
        // has to come before `resetModules`
        const logMock = require('../log');

        // setup
        jest.resetModules()
        jest.doMock('./.synd.config.js', () => 'invalid')

        const result = getPresetConfig('lol');

        expect(result).toEqual(undefined);
        expect(logMock.errorAndExit.mock.calls.length).toBe(1);
        expect(logMock.errorAndExit.mock.calls[0][0]).toBe(
            '~/.synd.config.js is invalid',
        );
    });
});
