#!/usr/bin/env node

'use strict';

var program = require('commander'),
    serve = require('./lib/serve'),
    build = require('./lib/build'),
    Path = require('path');

var OPTIONS = [
    {
        name: 'template',
        default: null,
        option: ['-t, --template <template>', 'specify a global template file', String]
  },
    {
        name: 'engine',
        default: 'swig',
        option: ['-e, --engine <name>', 'specify the templating engine', String]
  },
    {
        name: 'port',
        default: 3000,
        option: ['-p, --port <port>', 'specify the port [3000]', Number]
  },
];

OPTIONS.forEach(function(opt) {
    program.option.apply(program, opt.option);
});

function help() {
    console.log('Usage:\n');
    console.log('$ cmd.js build content public\n');
    console.log('$ cmd.js serve public\n');
    console.log('');
}

function globals(src, dst) {
    return {
        source: Path.resolve(src),
        target: Path.resolve(dst),
        globals: OPTIONS.reduce(function(globals, value) {
            globals[value.name] = program[value.name] || value.default;
            return globals;
        }, {})
    };
}

program.on('--help', help);

program
    .command('serve <src>')
    .description('serve site')
    .action(function(src) {
        serve(globals(src, '__public'));
    });

program
    .command('build <src> <dst>')
    .description('build site')
    .action(function(src, dst) {
        build(globals(src, dst));
    });

program
    .command('*')
    .action(function() {
        console.error('ERR: No action specified\n');
        help();
    });


program.parse(process.argv);
