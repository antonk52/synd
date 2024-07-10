import {vi, describe, it, expect, beforeEach} from 'vitest';

vi.mock('../utils/getConfig', () => ({
    getConfig: vi.fn(() => {
        name: 'mocked-project';
    }),
}));
vi.mock('../utils', async importOriginal => ({
    // @ts-expect-error: test
    ...(await importOriginal()),
    getOnFileChangeFunc: vi.fn(),
    getSyncFunc: vi.fn(),
    getFilterFile: vi.fn(),
    getPaths: vi.fn(() => ({include: [], exclude: []})),
    parseConfig: vi.fn(),
    log: Object.assign(vi.fn(), {plain: vi.fn()}),
}));
vi.mock('lodash.debounce', () => ({default: vi.fn()}));
vi.mock('../getRsyncFunc', () => ({
    getRsyncFunc: vi.fn(),
}));
vi.mock('fs', () => {
    const watch = vi.fn();
    return {default: {watch}, watch};
});
vi.mock('process', () => ({
    // eslint-disable-next-line
    exit: (code: number) => {
        throw new Error(code.toString());
    },
}));

beforeEach(async () => {
    vi.restoreAllMocks();

    const {log} = await import('../utils');
    (log as any).mockRestore();
    const fs = await import('fs');
    (fs.watch as any).mockRestore();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

describe('syndProcess', () => {
    it('should show rsync command when "showRsyncCommand" is set to true', async () => {
        const {getRsyncFunc} = await import('../getRsyncFunc');
        const {syndProcess} = await import('../syndProcess');
        const commandMock = jest.fn();
        // @ts-expect-error mock
        getRsyncFunc.mockImplementation(() => ({command: commandMock}));
        const {parseConfig: parseConfigMock} = await import('../utils');
        // @ts-expect-error mock
        parseConfigMock.mockImplementation(() => ({
            src: 'src',
            dest: 'dest',
            showRsyncCommand: true,
        }));
        syndProcess('foobar', {});

        expect(commandMock.mock.calls.length).toBe(1);
    });
    it('should start watching for changes when "watch" is set to true', async () => {
        const fs = await import('fs');
        const {syndProcess} = await import('../syndProcess');
        const {parseConfig: parseConfigMock} = await import('../utils');
        parseConfigMock.mockImplementation(() => ({
            src: 'src/path',
            dest: 'dest',
            watch: true,
        }));
        // eslint-disable-next-line
        const sudoOnFileChangeFunc = () => {};
        const debounce = await import('lodash.debounce');
        debounce.mockImplementation(() => sudoOnFileChangeFunc);
        syndProcess('foobar', {});

        expect(fs.watch.mock.calls.length).toBe(1);
        expect(fs.watch.mock.calls[0].length).toBe(3);
        expect(fs.watch.mock.calls[0][0]).toEqual('src/path');
        expect(fs.watch.mock.calls[0][1]).toEqual({recursive: true});
    });
    it('should list presets when the flag is passed', async () => {
        const {getConfig} = await import('../utils');
        const {syndProcess} = await import('../syndProcess');
        getConfig.default.mockImplementation(() => ({
            a: {},
            b: {},
        }));
        const {log} = await import('../utils');

        expect(() => syndProcess(undefined, {list: true})).toThrowError('0');
        expect(log.plain.mock.calls.length).toBe(2);
        expect(log.plain.mock.calls[1][0]).toBe('- a\n- b');
    });
    it('should exit when preset is not in the config', async () => {
        const {getConfig} = await import('../utils');
        const {log} = await import('../utils');
        const {syndProcess} = await import('../syndProcess');
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
    it.only('should set up recursive file watcher, when watch is on', async () => {
        const fs = await import('fs');
        const debounce = await import('lodash.debounce');
        const {getRsyncFunc} = await import('../getRsyncFunc');
        const {syndProcess} = await import('../syndProcess');
        // @ts-expect-error: mock
        debounce.default.mockImplementationOnce((cb: AnyFunction) => cb);
        const execute = vi.fn();
        // @ts-expect-error: mock
        getRsyncFunc.mockImplementationOnce(() => ({execute}));

        let cb: void | AnyFunction;

        // @ts-expect-error: mock
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

        try {
            syndProcess('foo', {});
        } catch (e) {
            console.log('ERROR HERE', e);
        }

        expect(() => syndProcess('foo', {})).not.toThrow();
        // @ts-expect-error: mock
        expect(fs.watch.mock.calls).toHaveLength(1);
        // @ts-expect-error: mock
        expect(fs.watch.mock.calls[0][0]).toBe('src/path');
        // @ts-expect-error: mock
        expect(fs.watch.mock.calls[0][1]).toEqual({recursive: true});
        // @ts-expect-error: mock
        expect(fs.watch.mock.calls[0][2]).toBeInstanceOf(Function);

        expect(() => cb && cb()).not.toThrow();
        expect(execute.mock.calls).toHaveLength(1);
    });
});
