'use strict';

var pkg = require('./package'),
    generate = require('./generate'),
    fs = require('fs');

module.exports = function init(options) {
    generate(options, function(err, options) {
        var builder = [
            '#!/usr/bin/env node',
            '"use strict"',
            function builder(options) {
                require('mycelium').cli(options);
            }.toString(),
            'builder(' + JSON.stringify(options) + ');\n'
        ].join('\n');

        fs.writeFile('site.js', builder, function(err) {
            if (err) throw err;
            pkg(options, process.exit);
        });
    });
};
