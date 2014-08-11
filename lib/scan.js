'use strict';

var Walk = require('walk'),
    Path = require('path');

function sources(source, done) {
    var walker = Walk.walk(source),
        collect = [];

    walker.on('file', function(root, stats, next) {
        var src = Path.join(root, stats.name),
            parts = src.split('/'),
            ignore = parts.some(function(part) {
                return /^_/.test(part);
            });

        if (!ignore) {
            collect.push(src);
        }

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
