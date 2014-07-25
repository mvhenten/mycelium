'use strict';

var build = require('./build'),
    serve = require('./serve'),
    _ = require('lodash');

function help() {
    console.log('Usage:\n');
    console.log('$ site.js --watch build\n');
    console.log('$ site.js --port 3210 serve\n');
    console.log('');
}

function app(config) {
    var program = require('commander');

    program.option('-p, --port <port>', 'specify the port [3000]', Number);
    program.option('-w, --watch', 'watch source dir for changes', Boolean);
    program.on('--help', help);

    config.options = {
        port: program.port || 3210,
        watch: program.watch || false,
    };

    program
        .command('build')
        .description('Create website in ' + config.target)
        .action(_.partial(build, config));

    program
        .command('serve')
        .description('Create website in ' + config.target)
        .action(_.partial(serve, config));

    program
        .command('*')
        .action(function() {
            help();
        });

    program.parse(process.argv);
}

module.exports = app;
