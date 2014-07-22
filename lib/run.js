var slice = require('sliced'),
    async = require('async');

function run(options) {
    var queue = slice(arguments, 1, -1),
        done = slice(arguments, -1).pop();

    async.eachSeries(queue, function(task, next) {
        task(options, next);
    }, function(err) {
        if (err) throw err;
        done(err, options);
    });
}

module.exports = run;
