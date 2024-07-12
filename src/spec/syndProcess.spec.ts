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

    const {log} = require('../utils');
    log.mockRestore();
    const fs = require('node:fs');
    fs.watch.mockRestore();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

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
        const fs = require('node:fs');
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
    it('should exit when preset is not in the config', () => {
        const {getConfig} = require('../utils');
        const {log} = require('../utils');
        getConfig.mockImplementation(() => ({
            a: {},
        }));

        expect(() => syndProcess(undefined, {})).toThrowError('0');
        expect(log.mock.calls).toEqual([
            [
                'Preset name is missing, exiting. Run "synd <preset-name>". Exiting',
            ],
        ]);
    });
    it('should set up recursive file watcher, when watch is on', () => {
        const fs = require('node:fs');
        const debounce = require('lodash.debounce');
        const {getRsyncFunc} = require('../getRsyncFunc');
        debounce.mockImplementationOnce((cb: AnyFunction) => cb);
        const execute = jest.fn();
        getRsyncFunc.mockImplementationOnce(() => ({execute}));

        let cb: undefined | AnyFunction;

        fs.watch.mockImplementationOnce(
            (
                _pth: string,
                // object that has no fields
                _opts: Record<string, never>,
                callback: AnyFunction,
            ): void => {
                cb = callback;
            },
        );

        expect(() => syndProcess('foo', {})).not.toThrow();
        expect(fs.watch.mock.calls).toHaveLength(1);
        expect(fs.watch.mock.calls[0][0]).toBe('src/path');
        expect(fs.watch.mock.calls[0][1]).toEqual({recursive: true});
        expect(fs.watch.mock.calls[0][2]).toBeInstanceOf(Function);

        expect(() => cb?.()).not.toThrow();
        expect(execute.mock.calls).toHaveLength(1);
    });
});
