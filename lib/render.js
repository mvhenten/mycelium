'use strict';

var fs = require('fs'),
    Path = require('path'),
    log = require('./log'),
    mkdirp = require('mkdirp'),
    _ = require('lodash'),
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

    if (source.body)
        return template(config, source, next);

    log.info('Linking %s > %s', source.relative, source.target);

    return fs.unlink(source.target, function() {
        return fs.link(source.source, source.target, next);
    });
}


module.exports = function render(config, done) {
    async.each(config.sources, _.partial(write, config), done);
};
