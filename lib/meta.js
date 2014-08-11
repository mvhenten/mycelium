'use strict';

var _ = require('lodash'),
    Path = require('path'),
    fs = require('fs'),
    fm = require('front-matter'),
    async = require('async');

function targetFilename(source) {
    if (/index.md$/.test(source)) return 'index.html';
    return source.replace(/[.]md$/, '/index.html')
}

var Files = {
    markdown: function(config, source, next) {
        var target = targetFilename(source),
            result = {
                link: target,
                type: 'markdown',
                relative: source,
                target: Path.join(config.target, target),
                source: Path.join(config.source, source)
            };

        front(result.source, function(err, data) {
            if (err) next(err);
            next(err, _.extend(result, data));
        });
    },

    file: function(config, source, next) {
        var target = source;

        return next(null, {
            link: target,
            type: 'file',
            relative: source,
            source: Path.join(config.source, source),
            target: Path.join(config.target, source)
        });
    }
};

function front(path, next) {
    fs.readFile(path, function(err, data) {
        if (err) return next(err);
        return next(null, fm(data.toString()));
    });
}

function parse(config, source, next) {
    if (/.md$/.test(source))
        return Files.markdown(config, source, next);

    return Files.file(config, source, next);
}

function meta(config, source, next) {
    var relative = source.replace(new RegExp('^' + config.source), '');

    parse(config, relative, function(err, result) {
        config.sources.push(result);
        return next(err, config);
    });
}

function metaData(config, done) {
    var sources = config.sources;

    config.sources = [];

    async.reduce(sources, config, meta, function(err, config) {
        done(err, config);
    });

}

module.exports = metaData;
