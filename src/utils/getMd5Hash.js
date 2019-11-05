const crypto = require('crypto');

const getMd5Hash = data =>
    crypto
        .createHash('md5')
        .update(data)
        .digest('hex');

module.exports = getMd5Hash;
