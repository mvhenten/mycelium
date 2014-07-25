'use strict';

var npm = require('npm'),
    log = require('./log'),
    Path = require('path'),
    fs = require('fs');

var MYCELLUM_PACKAGE_DIR = Path.resolve(__dirname + '/../');

var DEPENDENCIES = [
    MYCELLUM_PACKAGE_DIR,
    'async',
    'cli-color',
    'commander',
    'connect',
    'consolidate',
    'front-matter',
    'lodash',
    'marked',
    'mkdirp',
    'npm',
    'serve-static',
    'sliced',
    'sprintf',
    'strftime',
    'walk',
];

module.exports = function packate(config, done) {
    var modules = DEPENDENCIES,
        npmcfg = {
            save: true,
            silent: true,
            quiet: true,
        };

    modules.concat(config.engines);
    fs.writeFileSync('package.json', JSON.stringify({}));

    npm.load(npmcfg, function(err) {
        if (err) throw err;

        npm.commands.install(modules, function() {
            log.success('Initialized package.json in %s', process.cwd());
            done();
        });
    });

};
