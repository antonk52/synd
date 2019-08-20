const process = require('process');

const getHomeDir = () => (
    process.env.HOME ||
    process.env.HOMEPATH ||
    process.env.USERPROFILE
);

module.exports = getHomeDir;
