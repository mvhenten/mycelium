'use strict';

var _ = require('lodash'),
    Path = require('path');

function node(tree, parts, item) {
    var part = parts.shift();

    if (!parts.length){
        tree[part] = item;
        return;
    }

    tree[part] = tree[part] || [];
    return node(tree[part], parts, item);
}

module.exports = function transform(config, done) {
    config.pages = _.reduce(config.sources, function(tree, source) {
        var parts = source.relative.slice(1).split('/').slice(0, -1),
            filebody = Path.basename(source.relative).replace(new RegExp(Path.extname(source.relative) + '$'), '');

        parts.push(filebody);
        node(tree, parts, source);

        return tree;
    }, []);

    done(null, config);
};
