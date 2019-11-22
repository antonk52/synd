/* istanbul ignore file */
const process = require('process');
const kleur = require('kleur');

const stamp = () => {
    const d = new Date();

    return `[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`;
};

const log = string =>
    process.stdout.write(`${kleur.gray(stamp())} ${string}\n`);

const plain = string => process.stdout.write(`${string}\n`);

const errorAndExit = reason => {
    const output = [
        '\n\n',
        kleur.bgRed().black(' Exiting now '),
        '\n\n',
        'reason: ',
        kleur.dim().yellow(reason),
        '\n\n',
    ].join('');
    process.stdout.write(output);
    process.exit(1);
};

module.exports = Object.assign(log, {errorAndExit, plain});
