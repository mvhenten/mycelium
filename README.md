mycelium
========

A Static Site Generator Generator

I'm working on this, it may or may not become finished at any time. If you're looking
for a decent site generator, there are plenty available:

* [Wintersmith](http://wintersmith.io/)
* [Docpad](http://docpad.org/)
* [Blacksmith](https://github.com/flatiron/blacksmith)
* [Wheat](https://github.com/creationix/wheat)
* [Petrify](https://github.com/caolan/petrify)

## Install

    npm install -g mycelium

## Usage

    mycelium init <source dir> <target dir>

This will create a new npm package in the current directory, containing an executable javascript
file that will render markdown files from `<source dir>` into html files to `<target dir>`.

It'll also hopefully download and install any dependencies needed.

## Howto

Any files in `<source>` are transferred to `<public>`. Files with the `.md` extension are
assumed to be markdown files, that are wrapped usinga template from the `template` dir.

Front matter is available inside the template.

```bash
    mkdir my-static-site
    cd my-static-ste
    mkdir content template
    echo -e "---\ntitle: Hello World\n---\n## Hello World\n\nThis is just a simple markdown file\n" > content/index.md
    echo -e "<html>\n\t<head>\n<title>{{title}}</title>\n</head>\n<body>{{content|raw}}</body>\n</html>" > template/index.swig
    ./index.js serve
    # now go to http://127.0.0.1:3210
```

## Front matter

Folowing variables in the front-matter are considered "special":

##### template

Indicates the template file to be used. The templating engine is guessed from the extension
of the template-file ( e.g. `swig`, `eco`, `ejs` ). Templating is done using [consolidate](https://www.npmjs.org/package/consolidate).

More to follow ( e.g. `tags`, `categories`, `date` ).


## Motif

Static site generators are fun :)

There are many site generators out there - this is yet another one that fits my specific
needs to replace a Wordpress blog, a jekyll site, a one-page project site and a simple company
website with three pages.

## TODO

Allow for middlewares to hook into the process at any stage, so I can write custom extentions
on a per-site basis for adding template tags, less rendering and image scaling.
