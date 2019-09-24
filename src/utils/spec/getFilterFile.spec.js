const getFilterFile = require('../getFilterFile');

jest.mock('path', () => ({resolve: (a, b) => [a, b].join('/')}));
jest.mock('md5', () => () => 'HASH');
jest.mock('../getHomeDir', () => () => 'HOMEDIR');
jest.mock('../log', () => () => {});
jest.mock('fs', () => ({
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    writeFileSync: jest.fn(),
}));

describe('getFilterFile', () => {
    it('should return null when include and exclude are empty arrays', () => {
        const result = getFilterFile({include: [], exclude: []});
        const expected = null;

        expect(result).toEqual(expected);
    });

    it('should call fs.writeFileSync with given params', () => {
        const fsMock = require('fs');
        const result = getFilterFile({
            include: ['a', 'b'],
            exclude: ['c', 'd'],
            name: 'PRESET_NAME',
        });
        const expected = 'HOMEDIR/.synd/PRESET_NAME.HASH.filter';

        expect(result).toEqual(expected);
        expect(fsMock.writeFileSync.mock.calls.length).toEqual(1);
        expect(fsMock.writeFileSync.mock.calls[0][0]).toEqual(expected);
        expect(fsMock.writeFileSync.mock.calls[0][1]).toEqual(
            '- c\n- d\n+ a\n+ b',
        );
    });
});
