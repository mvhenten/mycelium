'use strict';

var init = require('./init'),
    Path = require('path'),
    program = require('commander');

module.exports = function app() {

    program
        .command('init [source] [target]')
        .description('Create new static site generator')
        .action(function(source, target) {
            var config = {
                source: source || 'content',
                target: target || 'public',
                middleware: program.middleware,
                output: program.output || 'index.js',
                templatePath: Path.resolve(program.templatePath || './template'),
                template: program.template || '/index.swig'
            };

            init(config, process.exit);
        });

    program
        .version('0.0.1')
        .option('-m, --middleware <file>', 'specify a pre-render middleware', String)
        .option('-t, --template <template>', 'specify a global template [index.swig]', String)
        .option('-p, --template-path <path>', 'template path [./template]', String)
        .option('-o, --output <name>', 'name of the output file [index.js]', String)
        .parse(process.argv);

    if (program.args.length === 0) program.help();
};
