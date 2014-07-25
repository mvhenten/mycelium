'use strict';

var fs = require('fs'),
    Path = require('path'),
    log = require('./log'),
    mkdirp = require('mkdirp'),
    _ = require('lodash'),
    rmdir = require('rmdir'),
    async = require('async'),
    cons = require('consolidate');

function template(config, source, done) {
    var tpl = Path.join(config.templatePath, source.attributes.template || config.template),
        engine = Path.extname(tpl).slice(1),
        locals = null;

    if (!cons[engine]) throw 'Unknown template engine: ' + engine;

    log.info('Rendering %s > %s', source.relative, source.target);

    locals = _.extend({
        config: config,
        content: source.body,
    }, source.attributes);

    cons[engine](tpl, locals, function(err, html) {
        fs.writeFile(source.target, html, done);
    });
}

function write(config, source, next) {
    mkdirp.sync(Path.dirname(source.target));

    return fs.unlink(source.target, function() {
        if (source.type == 'markdown')
            return template(config, source, next);

        log.info('Linking %s > %s', source.relative, source.target);

        return fs.link(source.source, source.target, next);
    });
}


module.exports = function render(config, done) {
    rmdir(config.target, function(err) {
        if (err) throw err;
        async.each(config.sources, _.partial(write, config), done);
    });

};
