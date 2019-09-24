const syndProcess = require('../syndProcess');

jest.mock('../utils', () => ({
    getOnFileChangeFunc: jest.fn(),
    getSyncFunc: jest.fn(),
    getFilterFile: jest.fn(),
    getPaths: jest.fn(),
    parseConfig: jest.fn(),
    log: jest.fn(),
}));
jest.mock('../rsync', () => jest.fn());
jest.mock('fs', () => ({watch: jest.fn()}));

beforeEach(() => {
    jest.resetAllMocks();
});

describe('syndProcess', () => {
    it('should show rsync command when "showRsyncCommand" is set to true', () => {
        const rsyncMock = require('../rsync');
        const commandMock = jest.fn();
        rsyncMock.mockImplementation(() => ({command: commandMock}));
        const {parseConfig: parseConfigMock} = require('../utils');
        parseConfigMock.mockImplementation(() => ({
            src: 'src',
            dest: 'dest',
            showRsyncCommand: true,
        }));
        syndProcess('foobar');

        expect(commandMock.mock.calls.length).toBe(1);
    });
    it('should start watching for changes when "watch" is set to true', () => {
        const fs = require('fs');
        const {parseConfig: parseConfigMock} = require('../utils');
        parseConfigMock.mockImplementation(() => ({
            src: 'src/path',
            dest: 'dest',
            watch: true,
        }));
        const sudoOnFileChangeFunc = () => {};
        const {
            getOnFileChangeFunc: getOnFileChangeFuncMock,
        } = require('../utils');
        getOnFileChangeFuncMock.mockImplementation(() => sudoOnFileChangeFunc);
        syndProcess('foobar');

        expect(fs.watch.mock.calls.length).toBe(1);
        expect(fs.watch.mock.calls[0].length).toBe(3);
        expect(fs.watch.mock.calls[0]).toEqual([
            'src/path',
            {recursive: true},
            sudoOnFileChangeFunc,
        ]);
    });
});
