const log = require('./log');

const tapIntro = name => {
    log(`Gonna try to do the ${name} preset`);

    return name;
};

module.exports = tapIntro;
