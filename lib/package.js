'use strict';

var npm = require('npm'),
    Path = require('path'),
    fs = require('fs');

var MYCELLUM_PACKAGE_DIR = Path.resolve( __dirname + '/../' );

var DEPENDENCIES = [
    'commander',
    'connect',
    'consolidate',
    'front-matter',
    'marked',
    'mkdirp',
    MYCELLUM_PACKAGE_DIR,
    'serve-static',
];

function initPackage(options, done) {
    var config = {
        save: true
    };

    fs.writeFileSync('package.json', JSON.stringify({}));

    npm.load(config, function(err) {
        if (err) throw err;

        npm.commands.install(options.engines.concat(DEPENDENCIES), done);

        npm.on('log', function(message) {
            console.log(message);
        });
    });
}

module.exports = initPackage;
