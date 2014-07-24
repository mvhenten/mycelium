'use strict';

var slice = require('sliced'),
    async = require('async');

function run(options) {
    var queue = slice(arguments, 1, -1),
        done = slice(arguments, -1).pop();

    async.applyEachSeries(queue, options, done);
}

module.exports = run;
