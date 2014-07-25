'use strict';

var util = require('util'),
    sliced = require('sliced'),
    strftime = require('strftime'),
    clc = require('cli-color'),
    sprintf = require('sprintf');

function log() {
    console.log(sprintf.apply(null, sliced(arguments)));
}

function _stamp(color, type, args) {
    args[0] = clc[color].bold(sprintf('[%s] %s - ', type, strftime('%B %d, %y %H:%M:%S'))) + clc.blackBright(args[0]);

    log.apply(null, args);
}

log.error = function() {
    _stamp('red', 'error', sliced(arguments));
};

log.warn = function() {
    _stamp('yellow', 'warn', sliced(arguments));
};

log.debug = function() {
    _stamp('magentaBright', 'debug', sliced(arguments));
};

log.log = function() {
    _stamp('blue', 'log', sliced(arguments));
};

log.info = function() {
    _stamp('magenta', 'info', sliced(arguments));
};

log.ok = function() {
    var args = sliced(arguments);
    args[0] = clc.green(args[0]);
    log.apply(null, args);
};


log.inspect = function(obj, depth, hidden) {
    hidden = (hidden !== undefined) ? hidden : true;
    depth = depth || 20;

    var str = util.inspect(obj, {
        depth: 1212,
        showHidden: hidden
    });
    log(clc.cyan(str));
};


module.exports = log;
