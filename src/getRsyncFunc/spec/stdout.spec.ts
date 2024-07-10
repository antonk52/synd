import {vi, describe, expect, it} from 'vitest';
import {onStdout} from '../stdout';

vi.mock('../../utils', () => ({log: vi.fn()}));
vi.mock('kleur', () => ({
    default: {
        yellow(x: string) {
            return x;
        },
    },
    yellow(x: string): string {
        return x;
    },
}));
describe('onStdout', () => {
    it('should log files, filtering out stuff', async () => {
        const {log} = await import('../../utils');

        const files = ['./', './some/path', './another/path'];
        const input = Buffer.from(files.join('\n'), 'utf8');

        onStdout(input);

        expect((log as any).mock.calls).toEqual(
            files.slice(1).map(x => [`uploading  ${x}`]),
        );
    });
});
