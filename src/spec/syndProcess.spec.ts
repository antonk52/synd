import {syndProcess} from '../syndProcess';

jest.mock('../utils', () => ({
    getOnFileChangeFunc: jest.fn(),
    getSyncFunc: jest.fn(),
    getFilterFile: jest.fn(),
    getPaths: jest.fn(() => ({include: [], exclude: []})),
    getConfig: jest.fn(),
    parseConfig: jest.fn(),
    log: Object.assign(jest.fn(), {plain: jest.fn()}),
}));
jest.mock('lodash.debounce', () => jest.fn());
jest.mock('../getRsyncFunc', () => ({
    getRsyncFunc: jest.fn(),
}));
jest.mock('fs', () => ({watch: jest.fn()}));
jest.mock('process', () => ({
    // eslint-disable-next-line
    exit: (code: number) => {
        throw new Error(code.toString());
    },
}));

beforeEach(() => {
    jest.restoreAllMocks();
});

describe('syndProcess', () => {
    it('should show rsync command when "showRsyncCommand" is set to true', () => {
        const {getRsyncFunc} = require('../getRsyncFunc');
        const commandMock = jest.fn();
        getRsyncFunc.mockImplementation(() => ({command: commandMock}));
        const {parseConfig: parseConfigMock} = require('../utils');
        parseConfigMock.mockImplementation(() => ({
            src: 'src',
            dest: 'dest',
            showRsyncCommand: true,
        }));
        syndProcess('foobar', {});

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
        // eslint-disable-next-line
        const sudoOnFileChangeFunc = () => {};
        const debounce = require('lodash.debounce');
        debounce.mockImplementation(() => sudoOnFileChangeFunc);
        syndProcess('foobar', {});

        expect(fs.watch.mock.calls.length).toBe(1);
        expect(fs.watch.mock.calls[0].length).toBe(3);
        expect(fs.watch.mock.calls[0][0]).toEqual('src/path');
        expect(fs.watch.mock.calls[0][1]).toEqual({recursive: true});
    });
    it('should list presets when the flag is passed', () => {
        const {getConfig} = require('../utils');
        getConfig.mockImplementation(() => ({
            a: {},
            b: {},
        }));
        const {log} = require('../utils');

        expect(() => syndProcess(undefined, {list: true})).toThrowError('0');
        expect(log.plain.mock.calls.length).toBe(2);
        expect(log.plain.mock.calls[1][0]).toBe('- a\n- b');
    });
});
