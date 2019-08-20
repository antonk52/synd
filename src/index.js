const program = require('commander');
const {version} = require('../package.json');

const syndProcess = require('./utils/syndProcess');

program
    .version(version, '-v, --version')
    .arguments('<preset>')
    .action(syndProcess);

program.parse(process.argv);
