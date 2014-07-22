#!/usr/bin/env node

'use strict';

module.exports = {
    init: require('./lib/init'),
    build: require('./lib/build'),
    serve: require('./lib/serve'),
    cli: require('./lib/cli'),
    run: require('./lib/run')
};
