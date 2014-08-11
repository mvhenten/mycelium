'use strict';

var marked = require('marked'),
    async = require('async');

function Transform(config) {
    this.config = config;
}

Transform.prototype = {
    transform: function(source, next) {
        if (!this[source.type])
            return next(null, source);

        return this[source.type](source, next);
    },

    markdown: function(source, next) {
        source.body = marked(source.body);
        next(null, source);
    },
};

module.exports = function transform(config, done) {
    var trans = new Transform(config);

    async.map(config.sources, trans.transform.bind(trans), function(err, sources) {
        config.sources = sources;
        done(err, config);
    });
};
