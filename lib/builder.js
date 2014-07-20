module.exports = function renderSite(queue, done) {
    'use strict';

    function renderPage(options, done) {
        var fs = require('fs'),
            Path = require('path'),
            marked = require('marked'),
            mkdirp = require('mkdirp'),
            front = require('front-matter'),
            cons = require('consolidate');

        fs.readFile(options.source, function(err, data) {
            var key, fm, html, locals = {};

            if (err) return done(err);

            mkdirp.sync(Path.dirname(options.target));

            fm = front(data.toString());
            html = marked(fm.body);

            if (!(options.globals.template || fm.attributes.template)) {
                fs.writeFileSync(html, options.target, done);
                return;
            }

            for ( key in options.globals) {
                locals[key] = options.globals[key];
            }

            for ( key in fm.attributes) {
                locals[key] = fm.attributes[key];
            }

            locals.template = Path.resolve(Path.join(Path.dirname(options.source), locals.template));

            cons[locals.engine](locals.template, locals, function(err, html) {
                fs.writeFile(options.target, html, done);
            });
        });
    }

    function render(queue, done) {
        var task = queue.pop();

        if (task) {
            renderPage(task, function() {
                render(queue, done);
            });
            return;
        }
        done();
    }

    render(queue, done);
};