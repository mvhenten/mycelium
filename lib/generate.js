'use strict';

var _ = require('lodash'),
    Walk = require('walk'),
    front = require('front-matter'),
    fs = require('fs'),
    Path = require('path');

function sources(options, done) {
    var walker = Walk.walk(options.source),
        collect = [];

    walker.on('file', function(root, stats, next) {
        if (!stats.name.match(/[.]md$/)) return next();

        collect.push(Path.join(root, stats.name));
        next();
    });

    walker.on('end', function() {
        done(null, collect);
    });
}

function getTarget(options, path) {
    var dir = Path.dirname(path).replace(options.source, ''),
        filename = Path.basename(path).replace(new RegExp(Path.extname(path)), '.html');

    return Path.join(options.target, dir, filename);
}

function getTemplateEngine(path, next) {
    var fm = null;

    fs.readFile(path, function(err, data) {
        if (err) return next(err);

        fm = front(data.toString());

        if (!fm) return next();
        return next(null, fm.attributes.engine);
    });
}

function getTemplateEngines(pages, engines, done) {
    var page = pages.pop();

    if (page) {
        getTemplateEngine(page.source, function(err, engine) {
            if (engine) engines.push(engine);
            getTemplateEngines(pages, engines, done);
        });
        return;
    }

    done(null, engines);
}

module.exports = function generate(options, done) {
    sources(options, function(err, files) {
        var pages = _.reduce(files, function(pages, path) {
            var target = getTarget(options, path);

            return pages.concat({
                globals: options.globals,
                source: path,
                target: target
            });
        }, []);

        getTemplateEngines(pages.slice(0), [], function(err, engines) {
            options.pages = pages;
            options.engines = engines;

            if (options.globals.engine)
                options.engines.push(options.globals.engine);

            done(null, options);
        });
    });
};
