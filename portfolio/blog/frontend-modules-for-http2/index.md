With the advent of HTTP 2.0 the old conventions of bundling and minifying a JavaScript application no longer completely apply. This is an opourtunity to **reinvent the way we handle module resolution** to achive 3 core tennets.

1. **Lazy Loading** - Download the minimum amount of code to make your application work.

2. **Multiplexing** - Speed up fetching your application through concurrent downloads, bearing in mind legacy support, and the header overhead of too many modules loading at the same time.

3. **Caching** - Moving control of caching to the client.

I propose a **Module Import API and Toolset** built on top of [Symlinks](https://en.wikipedia.org/wiki/Symbolic_link) and [SystemJS](https://github.com/systemjs) called **Universal Modules**.

```js
import React from 'react';

// Compiles down to
SystemJS.import('react');

// Which hits the endpoint
let moduleAPI = '/modules/react';

// And returns a js file 'vendor.min.js'
``` 

## Prior Art

### Webpack 2 

Webpack is a static JavaScript bundler that's extremely extendable.

Throughout the history of Webpack its community had a wide range of solutions to the problem of managing modules.

- **Bundling** - As successor to [Browserify](http://browserify.org/), Webpack came with bundling by default.

- **Import Anything** - Modules didn't have to simply be `.js` files, you could even import `.css`, `.html`, or any other format.

- **Chunks** - Split the application into chunks, such as a `vendor.js` for your libraries and `main.js` for your main application code.

- **Aggressive Splitting** - A [recent approach](https://medium.com/webpack/webpack-http-2-7083ec3f3ce6#.y6vm515rv) where files are separated according to an approximate size range that would generally be the most performant to download in HTTP2. 

- **Service Workers** - Handling the fetching of modules on a separate thread, this could even be set up to create logic that lets developers handle caching.

### SystemJS

**SystemJS** indexes files in a registry, which can be mapped in any way your use case sees fit. Combine this with a mix of static compilation/minification and you have the potential of having an extremely dynamic application.

Lets take a simple example where a frontend router is supposed to fetch a view. 

In SystemJS, that import statment is converted to a **Promise** to the registry that `'./views'` contains a module with an `About` React class.

### Dynamic `import()` Proposal

Recently a [proposal](https://github.com/tc39/proposal-dynamic-import) for a function like import is currently at **Stage 3** in the specification. This proposal built on top of the [Loader spec](https://github.com/whatwg/loader) and [System spec](https://github.com/ModuleLoader/es-module-loader/blob/master/docs/system-register.md) and chose to reduce the scope of the solution to one function that behaves exactly like `SystemJS.import`. 

The ideal scenario would be a mix of both *static* and *dynamic* runtimes, using one or the other whenever nessecary, instead of having to be forced to only static analysis like in Webpack (even though that works really well for most use cases), or only dynamic loading like SystemJS.

#### Use Case

We needed to dynamically load plugins in our application on runtime that could depend on other plugins. These plugins had metadata in the form of their package.json files that needed to be referenced by the main application the serve case specific content. 

For example, on `https://alain.xyz/blog`, each post depends on a `blog` sub-application that's configured through some metadata through a build step.

## Our Method

```bash
|- modules/
  |- vendor.js      # Chunk containing primary dependencies
  |- react          # Symlink to vendor.js
  |- react-dom      # Symlink to vendor.js
  |- react-router   # ...
  |- ...
  |- alain.xyz/
    |- index.js     # Module 'alain.xyz'
    |- views/       # Module blog, split for lazy loading
      |- about.js   # Module about, split for lazy loading
... 
```

We compile our application and its sub-modules in a folder called modules, and provide Symlinks to common peer dependencies. If a module is currently registered on runtime, we refer to this static endpoint to fetch bundles or individual modules.

```js
import {Builder} from 'universal-modules';

builder.use()
```