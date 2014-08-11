#!/usr/bin/env node

'use strict';

var Mycelium = require('../index'),
    program = require('commander'),
    Path = require('path');

function options(program) {
    return {
        port: program.port || 3210,
        watch: program.watch || false,
        templatePath: program.templatePath || 'swig',
        engine: program.engine || 'swig',
        config: program.config || 'mycelium.json'
    };
}


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


program.on('--help', help);

program
    .command('init <src> <dst>')
    .description('init site')
    .action(function(src, dst) {
        Mycelium.init(globals(src, dst));
    });

program
    .command('*')
    .action(function() {
        console.error('ERR: No action specified\n');
        help();
    });


program.parse(process.argv);
