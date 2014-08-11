'use strict';

var async = require('async'),
    Path = require('path'),
    meta = require('./meta'),
    log = require('./log'),
    watch = require('./watch'),
    render = require('./render'),
    _ = require('lodash'),
    scan = require('./scan'),
    transform = require('./transform'),
    tree = require('./tree');

function middleware(config, done) {
    if (!config.middleware) return done(null, config);
    require(config.middleware)(config, done);
}

module.exports = function build(config, done) {
    var tasks = [scan, meta, transform, middleware, tree, render];

    log.log('Build started');

    config = _.extend({
        templatePath: Path.join(Path.dirname(config.source), 'template'),
        template: 'index.swig',
    }, config);

    async.applyEachSeries(tasks, config, function() {
        log.log('Build finished.');

        if (config.options.watch) watch(config);

        if (typeof done === 'function')
            return done();
    });
};
