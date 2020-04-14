import {onStdout} from '../stdout';

jest.mock('../../utils', () => ({log: jest.fn()}));
jest.mock('kleur', () => ({
    yellow(x: string): string {
        return x;
    },
}));
describe('onStdout', () => {
    it('should log files, filtering out stuff', () => {
        const {log} = require('../../utils');

        const files = ['./', './some/path', './another/path'];
        const input = Buffer.from(files.join('\n'), 'utf8');

        onStdout(input);

        expect(log.mock.calls).toEqual(
            files.slice(1).map(x => [`uploading  ${x}`]),
        );
    });
});
