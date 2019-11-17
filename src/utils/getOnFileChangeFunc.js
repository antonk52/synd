const kleur = require('kleur');

const log = require('./log');

const getOnFileChangeFunc = data => {
    function onFileChangeFunc(eventType, filename) {
        log(`${kleur.yellow(eventType)} ${filename}`);
        data.syncFunc();
    }

    return onFileChangeFunc;
};

module.exports = getOnFileChangeFunc;
