'use strict';

var chokidar = require('chokidar'),
    _ = require('lodash'),
    log = require('./log');

function change(config) {
    var build = require('./build');
    build(config);
}

module.exports = function watch(config) {
    var watchdirs = config.watchdirs || [],
        watchcfg = _.extend({}, config);

    watchcfg.options.watch = false;

    watchdirs.push(config.templatePath);
    watchdirs.push(config.source);

    log.info('Watching: %s', watchdirs.join(','));

    chokidar
        .watch(watchdirs, {
            persistent: true,
            ignoreInitial: true
        })
        .on('all', _.partial(change, watchcfg));
};
