'use strict';

var initPackage = require('./init-package'),
    generate = require('./generate'),
    fs = require('fs'),
    builder = require('./builder');

function build(options) {

    generate(options, function(err, options) {
        var build = [builder.toString(), 'renderSite(' + JSON.stringify(options.pages) + ', process.exit );'].join('\n');

        fs.writeFile('build.js', build, function(err) {
            if (err) throw err;

            initPackage(options, process.exit);
        });
    });
}

module.exports = build;
