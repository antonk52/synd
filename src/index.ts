import {syndProcess} from './syndProcess';
import {getConfig, log} from './utils';
import {parseArgs} from 'node:util';

const help = `Usage: synd [options] [preset]

Options:
  -l, --list     list all presets
  -v, --version  output the version number
  -h, --help     display help for command`;

function synd() {
    const args = parseArgs({
        options: {
            list: {type: 'boolean', short: 'l'},
            help: {type: 'boolean', short: 'h'},
            version: {type: 'boolean', short: 'v'},
        },
        allowPositionalOptions: true,
        allowPositionals: true,
        strict: true,
    });

    if (args.values.help) {
        return console.log(help);
    }

    if (args.values.version) {
        return console.log(`Version: ${require('../package.json')?.version}`);
    }

    const syndConfig = getConfig();

    if (args.values.list) {
        log.plain('Your presets:');
        log.plain(
            Object.keys(syndConfig)
                .map(k => `- ${k}`)
                .join('\n'),
        );

        return;
    }

    const presetName = args.positionals[0];
    if (!presetName) {
        log(
            `Preset name is missing, exiting. Run "synd <preset-name>". Exiting`,
        );
        return;
    }
    log(`Attepting "${presetName}" preset`);

    return syndProcess(syndConfig, presetName);
}

synd();
