const validatePresetConfig = require('../validatePresetConfig');

jest.mock('../log', () => ({
    errorAndExit: jest.fn(arg => {
        throw Error(arg)
    }),
}));

beforeEach(() => {
    const mock = require('../log');
    mock.errorAndExit.mockClear();
})

describe('validatePresetConfig function', () => {
    const PRESET_NAME = 'PRESET_NAME';

    it('should return true for a minimal valid config', () => {
        const mockLog = require('../log');
        const minimalConfig = {
            src: 'src/utils/spec',
            dest: 'another'
        };

        let result = validatePresetConfig(minimalConfig);

        expect(() => {result = validatePresetConfig(minimalConfig, PRESET_NAME)}).not.toThrow();
        expect(mockLog.errorAndExit.mock.calls.length).toBe(0);
        expect(result).toBe(true);
    });

    it('should log error and exit when src property does not exist', () => {
        const mockLog = require('../log');
        const minimalConfig = {
            src: null,
            dest: 'another'
        };

        expect(() => validatePresetConfig(minimalConfig, PRESET_NAME))
            .toThrow(
                Error("Empty 'src' in PRESET_NAME preset. Make sure property 'name' is set.")
            );
        expect(mockLog.errorAndExit.mock.calls.length).toBe(1);
    });

    it('should log error and exit when src does not exist', () => {
        const mockLog = require('../log');
        const minimalConfig = {
            src: 'non existing path',
            dest: 'another'
        };

        expect(() => validatePresetConfig(minimalConfig, PRESET_NAME))
            .toThrow(
                Error("Invalid 'src' in PRESET_NAME preset. Make sure property 'name' is set to a valid path")
            );
        expect(mockLog.errorAndExit.mock.calls.length).toBe(1);
    });

    it('should log error and exit when dest is not a string', () => {
        const mockLog = require('../log');
        const minimalConfig = {
            src: 'src/utils/spec',
            dest: null
        };

        expect(() => validatePresetConfig(minimalConfig, PRESET_NAME))
            .toThrow(
                Error(`Invalid 'dest' property in "PRESET_NAME". Make sure property 'dest' is set to a valid path.`)
            );
        expect(mockLog.errorAndExit.mock.calls.length).toBe(1);
    });
});
