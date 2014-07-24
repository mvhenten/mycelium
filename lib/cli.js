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
        meta = require('./meta'),
        program = require('commander');

    program.option('-p, --port <port>', 'specify the port [3000]', Number);
    program.option('-w, --watch', 'watch source dir for changes', Boolean);
    program.on('--help', help);

    program
        .command('build')
        .description('Create website in ' + config.target)
        .action(function() {
            config.templatePath = config.source + '/template';
            config.options = options(program);
            config.template = 'template/index.swig.html';

            run(config, scan, meta, function(err, config) {
                var util = require('util');
                console.log(util.inspect(config, {
                    depth: 20
                }) + '');
            });

        });

    program
        .command('serve')
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
