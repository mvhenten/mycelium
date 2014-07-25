'use strict';

var async = require('async'),
    Path = require('path'),
    meta = require('./meta'),
    log = require('./log'),
    render = require('./render'),
    _ = require('lodash'),
    scan = require('./scan'),
    transform = require('./transform'),
    tree = require('./tree');

module.exports = function build(config, done) {
    var tasks = [scan, meta, transform, tree, render];

    log.log('Build started');

    config = _.extend({
        templatePath: Path.join(Path.dirname(config.source), 'template'),
        template: 'index.swig',
    }, config);

    async.applyEachSeries(tasks, config, function() {
        log.log('Build finished.');

        if (done) return done();
        return process.exit();
    });
};
