'use strict';

function help() {
    console.log('Usage:\n');
    console.log('$ site.js --watch build\n');
    console.log('$ site.js --port 3210 serve\n');
    console.log('');
}

function options(program) {
    return {
        port: program.port || 3210,
        watch: program.watch || false,
    };
}


function app(config) {
    var run = require('./run'),
        scan = require('./scan'),
        program = require('commander');

    program.option('-p, --port <port>', 'specify the port [3000]', Number);
    program.option('-w, --watch', 'watch source dir for changes', Boolean);
    program.on('--help', help);

    program
        .command('build')
        .description('Create website in ' + config.target)
        .action(function() {
            config.options = options(program);

            run(config, scan, function(err, config) {
                console.log(config);
            });

        });

    program
        .command('build')
        .description('Create website in ' + config.target)
        .action(function() {
            console.log('serving the world');
            // Mycelium.serve(config, options(program));
        });

    program
        .command('*')
        .action(function() {
            help();
        });

    program.parse(process.argv);
}

module.exports = app;
