const parseConfig = require('../parseConfig');

jest.mock('../getPresetConfig', () => jest.fn());
jest.mock('../validatePresetConfig', () => jest.fn());

describe('parseConfig', () => {
    it('should not modify dest when "server" is not provided', () => {
        const getPresetConfigMock = require('../getPresetConfig');
        const config = {
            src: 'src/path',
            dest: 'dest/path',
        };
        getPresetConfigMock.mockImplementation(() => config);
        
        const result = parseConfig('foo');

        expect(result.src).toEqual(config.src);
        expect(result.dest).toEqual(config.dest);
    });
    it('should append "server" when it is provided', () => {
        const getPresetConfigMock = require('../getPresetConfig');
        const config = {
            src: 'src/path',
            dest: 'dest/path',
            server: 'server.org',
        };
        getPresetConfigMock.mockImplementation(() => config);
        
        const result = parseConfig('foo');

        expect(result.src).toEqual(config.src);
        expect(result.dest).toEqual(`${config.server}:${config.dest}`);
    });
});
