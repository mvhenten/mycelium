'use strict';

var pkg = require('./package'),
    async = require('async'),
    Path = require('path'),
    meta = require('./meta'),
    log = require('./log'),
    _ = require('lodash'),
    scan = require('./scan'),
    fs = require('fs');

function write(config, next) {
    var builder = [
        '#!/usr/bin/env node',
        '"use strict"',
        function builder(config) {
            require('mycelium').cli(config);
        }.toString(),
        'builder(' + JSON.stringify(config) + ');\n'
    ].join('\n');

    fs.writeFile(config.output, builder, function() {
        fs.chmod(config.output, '0775', next);
    });
}

function engines(config, next) {
    var collect = [Path.extname(config.template).slice(1)];

    config.engines = _.unique(_.reduce(_.filter(_.pluck(config.sources, 'attributes')), function(engines, attrs) {
        if (!attrs.template) return engines;

        return engines.concat(Path.extname(attrs.template).slice(1));
    }, collect));

    process.nextTick(next);
}

module.exports = function init(config, done) {
    var tasks = [scan, meta, engines, pkg, write];

    log.success('Initializing new site in %s', Path.resolve(process.cwd()));

    async.applyEachSeries(tasks, config, function(err) {
        if (err) throw err;

        delete(config.sources);


        log.ok('Configuration:');
        for (var key in config) {
            log.ok('\t- %s: %s', key, config[key]);
        }
        log.success('Created site generator %s/%s', Path.resolve(process.cwd()), config.output);
    }, done);
};
