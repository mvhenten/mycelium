#!/usr/bin/env node

'use strict';

var program = require('commander'),
    _ = require('lodash'),
    initPackage = require('./lib/init-package'),
    generate = require('./lib/generate'),
    fs = require('fs'),
    builder = require('./lib/builder'),
    Path = require('path');

var OPTIONS = {
    templateEngine: ['-t, --template <template>', 'specify a global template file', String, 200],
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

function build(src, dst) {
    var options = {
        source: Path.resolve(src),
        target: Path.resolve(dst),
        globals: _.reduce(OPTIONS, function(options, value, key) {
            options[key] = program[key];
            return options;
        }, {})
    };

    generate(options, function(err, options) {
        var build = [builder.toString(), 'renderSite(' + JSON.stringify(options.pages) + ', process.exit );'].join('\n');

        fs.writeFile('build.js', build, function(err) {
            if (err) throw err;

            initPackage(options, process.exit);
        });
    });
}

program.on('--help', help);

program
    .command('build <src> <dst>')
    .description('build site')
    .action(build);

program
    .command('*')
    .action(function() {
        console.error('ERR: No action specified\n');
        help();
    });


program.parse(process.argv);
