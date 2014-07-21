#!/usr/bin/env node

'use strict';

var connect = require('connect'),
    serveStatic = require('serve-static'),
    builder = require('./builder'),
    generate = require('./generate');

function serve(options) {
    var server = connect().use(serveStatic(options.target));

    generate(options, function(err, options) {
        builder(options.pages);

        server.listen(options.globals.port, function() {
            console.log('serving %s on port %s', options.target, options.globals.port);
        });
    });
}

module.exports = serve;
