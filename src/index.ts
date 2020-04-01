import program from 'commander';
import {syndProcess} from './syndProcess';

const {version} = require('../package.json');

program
    .option('--list', 'list all presets')
    .version(version, '-v, --version')
    .arguments('[preset]')
    .action(syndProcess);

program.parse(process.argv);
