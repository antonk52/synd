import crypto from 'node:crypto';

export const getMd5Hash = (data: string): string =>
    crypto.createHash('md5').update(data).digest('hex');
