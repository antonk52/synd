import {vi, describe, it, expect} from 'vitest';
import {parseConfig} from '../parseConfig';

vi.mock('../validatePresetConfig', () => ({validatePresetConfig: vi.fn()}));
vi.mock('../log', () => ({default: {errorAndExit: vi.fn()}}));

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
    it('should log and exit when preset is not in the config', async () => {
        const log = await import('../log');
        (log as any).default.errorAndExit.mockImplementationOnce(
            (msg: string) => {
                throw new Error(msg);
            },
        );

        expect(() => parseConfig({}, 'preset_name')).toThrowError(
            'preset_name is not in your .synd.config.js file',
        );
    });
});
