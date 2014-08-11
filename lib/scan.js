'use strict';

var Walk = require('walk'),
    Path = require('path');

function sources(source, done) {
    var walker = Walk.walk(source),
        collect = [];

    walker.on('file', function(root, stats, next) {
        collect.push(Path.join(root, stats.name));
        next();
    });

    walker.on('end', function() {
        done(null, collect);
    });
}

function scan(config, done) {
    sources(config.source, function(err, files) {

        config.sources = files;

        done();
    });
}

module.exports = scan;