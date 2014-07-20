#!/usr/bin/env node

'use strict';

var program = require('commander'),
    _ = require('lodash'),
    build = require('./lib/build'),
    Path = require('path');

var OPTIONS = {
    template: ['-t, --template <template>', 'specify a global template file', String, 200],
    engine: ['-e, --engine <name>', 'specify the templating engine', String, 'swig'],
    port: ['-p, --port <port>', 'specify the port [3000]', Number, 3000]
};

_.each(OPTIONS, function(opt) {
    program.option.apply(program, opt);
});

function help() {
    console.log('Usage:\n');
    console.log('$ cmd.js build content public\n');
    console.log('$ cmd.js serve public\n');
    console.log('');
}

program.on('--help', help);

program
    .command('build <src> <dst>')
    .description('build site')
    .action(function(src, dst) {
        var options = {
            source: Path.resolve(src),
            target: Path.resolve(dst),
            globals: _.reduce(options, function(OPTIONS, value, key) {
                options[key] = program[key];
                return options;
            }, {})
        };

        build(options);
    });

program
    .command('*')
    .action(function() {
        console.error('ERR: No action specified\n');
        help();
    });


program.parse(process.argv);
