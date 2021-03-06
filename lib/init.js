'use strict';

var pkg = require('./package'),
    async = require('async'),
    Path = require('path'),
    dependencies = require('./dependencies'),
    middleware = require('./middleware'),
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
        'builder(' + JSON.stringify(_.omit(config, 'sources'), null, 4) + ');\n'
    ].join('\n');

    fs.writeFile(config.output, builder, function() {
        fs.chmod(config.output, '0775', next);
    });
}

module.exports = function init(config, done) {
    var tasks = [scan, meta, dependencies, middleware, pkg, write];

    log.success('Initializing new site in %s', Path.resolve(process.cwd()));

    async.applyEachSeries(tasks, config, function(err) {
        if (err) throw err;

        delete(config.sources);

        log.success('Created site generator %s/%s', Path.resolve(process.cwd()), config.output);
        done();
    });
};
