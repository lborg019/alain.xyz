![Latest Cover](blog/raw-vulkan/assets/cover.png)

# [Alain.xyz Portfolio](http://alain.xyz/portfolio)

![Release][release-img] [![License][license-img]][license-url] [![Dependency Status][david-img]][david-url] [![devDependency Status][david-dev-img]][david-dev-url]

This repo indexes portfolio items to be featured in Alain.xyz, like blog posts, music, art, etc.

## Contributing

If you want to add to publish to the blog, you'll want to do a pull request. Please make sure to write your name in the article!

## How it Works

Every portfolio item is it's own subapplication loaded on demand by the core Alain.xyz Application.

The main application starts by querying the backend for a given portfolio item bound by a permalink. (These are populated by a custom CLI that parses the portfolio.)

```json
{
  "permalink": "blog/the-making-of-alain-xyz",
  "main": "blog/post.js",
  "data": "<h1>The Making of ...</h1><code> ...",
},
{
  "permalink": "courses/unreal/*",
  "title": "Unreal Game Development",
  "description": "A comprehensive introduction to Unreal Engine 4 from a C++ and artist standpoint.",
  "main": "courses/unreal/main.js",
  "data": "var s = \"this can be any string.\""
},
//...
```

If it hits a match, we'll recieve meta information related to the entry, it's coresponding main js file and data coresponding with that file.

The `default` export of that js file will be loaded as a React Component with a prop `config` equal to the entire structure from the backend, and have full access to all other portions of the core application, thus ever item is a **Sub-application**.

This lends itself to allowing for tons of reuse. Every book can either be its own app or build off the **Book** sub-application, every blog post can build off the **BlogPost** subapp, even the portfolio view and about pages are their own apps!

```tsx
// You can load any package from node.
import React from 'react';

// You can load anything from the primary app module.
import { Icon } from 'alain-xyz';

// You can even load local modules.
import {Home, Quiz} from './views';

// Your props are everything from the main app
// and a config with the schema of the current portfolio item.
export default (props) => (
    <ul>
      <li></li>
      <li>data: {props.config.data}</li>
    </ul>
);
```

[website-url]: https://alain.xyz
[release-img]: https://img.shields.io/badge/release-0.4.0-4dbfcc.svg?style=flat-square
[license-img]: http://img.shields.io/:license-mit-blue.svg?style=flat-square
[license-url]: https://opensource.org/licenses/MIT
[david-url]: https://david-dm.org/alaingalvan/alain.xyz?path=portfolio
[david-img]: https://david-dm.org/alaingalvan/alain.xyz.svg?path=portfolio&style=flat-square
[david-dev-url]: https://david-dm.org/alaingalvan/alain.xyz?path=portfolio#info=devDependencies
[david-dev-img]: https://david-dm.org/alaingalvan/alain.xyz/dev-status.svg?path=frontend&style=flat-square
