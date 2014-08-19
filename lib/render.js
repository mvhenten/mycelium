'use strict';

var fs = require('fs'),
    Path = require('path'),
    log = require('./log'),
    mkdirp = require('mkdirp'),
    _ = require('lodash'),
    rmdir = require('rmdir'),
    async = require('async'),
    cons = require('consolidate');


function clearCache(engine) {
    // dirty hack, as swig does not play well
    // with the cache: false option.
    if (engine === 'swig')
        require('swig').setDefaults({
            cache: false
        });

    // hammer it out just in case
    cons.clearCache();
}

function template(config, source, done) {
    var tpl = Path.join(config.templatePath, source.attributes.template || config.template),
        engine = Path.extname(tpl).slice(1),
        locals = null;

    if (!cons[engine]) throw 'Unknown template engine: ' + engine;

    log.info('Rendering %s > %s', source.relative, source.target);

    locals = {
        cache: false,
        site: config,
        page: source,
    };

    clearCache(engine);

    if (!tpl) throw new Error('no tpl', tpl);

    cons[engine](tpl, locals, function(err, html) {
        fs.writeFile(source.target, html, done);
    });
}

function write(config, source, next) {
    mkdirp.sync(Path.dirname(source.target));

    return fs.unlink(source.target, function() {
        if (source.type == 'markdown')
            return template(config, source, next);

        if (source.content) {
            log.info('Writing %s > %s', source.relative, source.target);
            return fs.writeFile(source.target, source.content, next);
        }

        log.info('Linking %s > %s', source.relative, source.target);

        return fs.link(source.source, source.target, next);
    });
}


module.exports = function render(config, done) {
    var init = function(err) {
        if (err) throw err;
        async.each(config.sources, _.partial(write, config), done);
    };

    if (fs.existsSync(config.target))
        return rmdir(config.target, init);

    return init();
};
