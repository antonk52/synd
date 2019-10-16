const program = require('commander');
const {version} = require('../package.json');

const syndProcess = require('./syndProcess');

program
    .option('--list', 'list all presets')
    .version(version, '-v, --version')
    .arguments('[preset]')
    .action(syndProcess);

program.parse(process.argv);
