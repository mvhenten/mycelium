'use strict';

var npm = require('npm'),
    fs = require('fs');

var DEPENDENCIES = ['marked', 'mkdirp', 'front-matter', 'consolidate'];

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
