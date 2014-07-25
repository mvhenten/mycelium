'use strict';

var build = require('./build'),
    serve = require('./serve'),
    _ = require('lodash');

function options(config, program) {
    config.options = {
        port: program.port || 3210,
        watch: program.watch || false,
    };
    return config;
}

function app(config) {
    var program = require('commander');

    program
        .command('build')
        .description('Create website in ' + config.target)
        .action(function() {
            build(options(config, program));
        });

    program
        .command('serve')
        .description('Create website in ' + config.target)
        .action(_.partial(serve, config));

    program.option('-p, --port <port>', 'specify the port [3000]', Number);
    program.option('-w, --watch', 'watch source dir for changes');

    program.parse(process.argv);
}

module.exports = app;
