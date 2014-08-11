'use strict';

var async = require('async'),
    Path = require('path'),
    builtins = require('builtins'),
    async = require('async'),
    fs = require('fs');

function dependencies(config, source, done) {
    return fs.readFile(source, function(err, src) {
        var sources = src.toString().match(/require\(.+?\)/gm) || [],
            requires = sources.map(function(match) {
                return match.replace(/require\(['"](.+)['"]\)/, '$1');
            });

        async.each(requires, function(dependency, next) {
            if (/^[.]/.test(dependency))
                return dependencies(config, Path.resolve(Path.join(Path.dirname(source), dependency + '.js')), done);
            else if (builtins.indexOf(dependency) === -1)
                config.dependencies.push(dependency);

            return next();
        }, done);
    });
}

module.exports = function middleware(config, next) {
    if (!config.middleware) return next();

    fs.exists(Path.resolve(config.middleware), function(exists) {
        if (!exists) return next();

        config.middleware = Path.resolve(config.middleware);

        dependencies(config, config.middleware, function() {
            console.log(config.dependencies);
            next();
        });
    });
};
