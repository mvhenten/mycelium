'use strict';

var _ = require('lodash'),
    Path = require('path');

module.exports = function dependencies(config, next) {
    var deps = [Path.extname(config.template).slice(1)];

    config.dependencies = _.unique(_.reduce(_.filter(_.pluck(config.sources, 'attributes')), function(deps, attrs) {
        if (attrs.template)
            deps.push(Path.extname(attrs.template).slice(1));

        if (attrs.dependencies)
            deps.concat(attrs.dependencies);

        return deps;
    }, deps));

    process.nextTick(next);
};
