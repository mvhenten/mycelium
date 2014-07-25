#!/usr/bin/env node

'use strict';

var init = require('../lib/init'),
    Path = require('path'),
    program = require('commander');

program.on('--help', function() {
    console.log('Usage:\n');
    console.log('$ site.js --watch build\n');
    console.log('$ site.js --port 3210 serve\n');
    console.log('');
});


program.option('-t, --template <template>', 'specify a global template [index.swig]', String);
program.option('-p, --template-path <path>', 'template path [./template]', String);
program.option('-o, --output <name>', 'name of the output file [index.js]', String);

program
    .command('init')
    .description('initializing website')
    .action(function(source, target) {
        var config = {
            source: source,
            target: target,
            output: program.output || 'index.js',
            templatePath: Path.resolve(program.templatePath || './template'),
            template: program.template || '/index.swig'
        };

        init(config, process.exit);
    });

program.parse(process.argv);
