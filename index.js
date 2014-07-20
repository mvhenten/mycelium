#!/usr/bin/env node

'use strict';

var program = require('commander'),
    _ = require('lodash'),
    build = require('./lib/build'),
    Path = require('path');

var OPTIONS = [
  {
    name: 'template',
    default: null,
    option: ['-t, --template <template>', 'specify a global template file', String ]
  },
  {
    name: 'engine',
    default: 'swig',
    option: ['-e, --engine <name>', 'specify the templating engine', String ]
  },
  {
    name: 'port',
    default: 3000,
    option: ['-p, --port <port>', 'specify the port [3000]', Number ]
  },
];


OPTIONS.forEach( function(opt) {
    program.option.apply(program, opt.option );
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
            globals: OPTIONS.reduce( function( globals, value, key) {
                globals[value.name] = program[value.name];
                return globals;
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
