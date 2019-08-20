const {log} = require('../utils');

const stderr = (...args) => {
    log('------ STERR');
    log(args);
};

module.exports = stderr;
