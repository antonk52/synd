/* istanbul ignore file */
import process from 'node:process';
import kleur from 'kleur';

const stamp = (): string => {
    const d = new Date();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');

    return `[${hours}:${minutes}:${seconds}]`;
};

const log = (text: string): void => {
    process.stdout.write(`${kleur.gray(stamp())} ${text}\n`);
};

const plain = (text: string): void => {
    process.stdout.write(`${text}\n`);
};

const errorAndExit = (reason: string): never => {
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

const logger = Object.assign(log, {errorAndExit, plain});

export default logger;
