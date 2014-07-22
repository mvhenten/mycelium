'use strict';

var _ = require('lodash'),
    Walk = require('walk'),
    front = require('front-matter'),
    fs = require('fs'),
    Path = require('path');

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
}

//function getTemplateEngine(path, next) {
//    var fm = null;
//
//    fs.readFile(path, function(err, data) {
//        if (err) return next(err);
//
//        fm = front(data.toString());
//
//        if (!fm) return next();
//        return next(null, fm.attributes.engine);
//    });
//}
//
//function getTemplateEngines(pages, engines, done) {
//    var page = pages.pop();
//
//    if (page) {
//        getTemplateEngine(page.source, function(err, engine) {
//            if (engine) engines.push(engine);
//            getTemplateEngines(pages, engines, done);
//        });
//        return;
//    }
//
//    done(null, engines);
//}
//
//module.exports = function generate(options, done) {
//    sources(options, function(err, files) {
//        var pages = _.reduce(files, function(pages, path) {
//            var target = getTarget(options, path);
//
//            return pages.concat({
//                globals: options.globals,
//                source: path,
//                target: target
//            });
//        }, []);
//
//        getTemplateEngines(pages.slice(0), [], function(err, engines) {
//            options.pages = pages;
//            options.engines = engines;
//
//            if (options.globals.engine)
//                options.engines.push(options.globals.engine);
//
//            done(null, options);
//        });
//    });
//};
