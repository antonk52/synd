const parseConfig = require('../parseConfig');

jest.mock('../validatePresetConfig', () => jest.fn());
jest.mock('../log', () => ({errorAndExit: jest.fn()}));

describe('parseConfig', () => {
    it('should not modify dest when "server" is not provided', () => {
        const config = {
            src: 'src/path',
            dest: 'dest/path',
        };
        const result = parseConfig({foo: config}, 'foo');

        expect(result.src).toEqual(config.src);
        expect(result.dest).toEqual(config.dest);
    });
    it('should append "server" when it is provided', () => {
        const config = {
            src: 'src/path',
            dest: 'dest/path',
            server: 'server.org',
        };
        const result = parseConfig({foo: config}, 'foo');

        expect(result.src).toEqual(config.src);
        expect(result.dest).toEqual(`${config.server}:${config.dest}`);
    });
    it('should log and exit when preset is not in the config', () => {
        const {errorAndExit} = require('../log');
        const result = parseConfig({}, 'preset_name');

        expect(result).toEqual(null);
        expect(errorAndExit.mock.calls.length).toBe(1);
        expect(errorAndExit.mock.calls[0][0]).toBe(
            'preset_name is not in your .synd.config.js file',
        );
    });
});
