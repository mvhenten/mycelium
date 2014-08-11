#!/usr/bin/env node

'use strict';

var connect = require('connect'),
    serveStatic = require('serve-static'),
    build = require('./build'),
    log = require('./log');

module.exports = function serve(config) {
    var server = connect().use(serveStatic(config.target));

    build(config, function() {
        server.listen(config.options.port, function() {
            log.success('serving %s on port %s', config.target, config.options.port);
        });
    });
};
