const getOnFileChangeFunc = require('../getOnFileChangeFunc');

jest.mock('../log', () => jest.fn());
jest.mock('chalk', () => ({yellow: jest.fn(x => x)}));

describe('getOnFileChangeFunc', () => {
    it('should return a valid function', () => {
        const logMock = require('../log');
        const syncFunc = jest.fn();
        const onFileChangeFunc = getOnFileChangeFunc({syncFunc});
        onFileChangeFunc('change', 'my-file');

        expect(syncFunc.mock.calls.length).toBe(1);
        expect(logMock.mock.calls.length).toBe(1);
        expect(logMock.mock.calls[0]).toEqual(['change my-file']);
    });
});
