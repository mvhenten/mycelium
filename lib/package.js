'use strict';

var npm = require('npm'),
    log = require('./log'),
    Path = require('path'),
    fs = require('fs');

module.exports = function packate(config, done) {
    var modules = config.dependencies,
        mycelium = Path.resolve(__dirname + '/../'),
        npmcfg = {
            save: true,
            silent: true,
            quiet: true,
        };

    modules.push(mycelium);

    fs.writeFileSync('package.json', JSON.stringify({}));

    npm.load(npmcfg, function(err) {
        if (err) throw err;

        npm.commands.install(modules, function() {
            log.success('Initialized package.json in %s', process.cwd());
            done();
        });
    });

};
