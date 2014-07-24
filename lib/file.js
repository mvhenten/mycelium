'use strict';

var Path = require('path');

function File(options, source) {
    this.options = options;
    this.source = source;
}

File.prototype = {
    get target() {
        var dir = Path.dirname(this.source).replace(this.options.source, ''),
            filename = Path.basename(this.source).replace(new RegExp(Path.extname(this.source)), '.html');

        return Path.join(this.options.target, dir, filename);
    },

    render: function(done) {

    }
};
