![Latest Cover](blog/the-making-of-alain-xyz/assets/cover.png)

# [Alain.xyz](http://alain.xyz/portfolio) Portfolio

![Release][release-img] [![License][license-img]][license-url] [![Dependency Status][david-img]][david-url] [![devDependency Status][david-dev-img]][david-dev-url]

This Repo indexes portfolio items to be featured in Alain.xyz, like blog posts, music, art, etc.

## Usage

```bash
# 🔳 Start Alain.xyz Builder
npm start
```

This portfolio is indexed by the Alain.xyz Builder, compiling markdown, building subapplications, and indexing static assets.

## File Structure

```bash
# Business
├─ businesses/ # 🏬 Physical Products
# Writings
├─ research/   # 📄 Research Papers
├─ talks/      # 🗨️ Conference Presentations
├─ books/      # 📘 Books
├─ readings/   # 👓 Reviews/Notes/Audio Clips
├─ blog/       # 📰 Blog Articles
# Code
├─ apps/       # 🅰️️ Applications
├─ libraries/  # 📚 Libraries
# Audio
├─ podcasts/   # 🎤 Podcasts
├─ music/      # 🎵 Music
# Art
├─ art/        # 🎨 Paintings
├─ video/      # 🎥 Shows, Movies, etc
# Builder
└─ scripts/    # 🔳 Alain.xyz Builder
```

## Contributing

If you want to add to publish to the blog, you'll want to do a pull request. Please make sure to write your name in the article!

### Guidelines

1. Covers must be:
  - 1080p
  - Have no logo or readable text at the center of the image.
  - Have a balanced color gradient, avoiding whites.


## How it Works

Every portfolio item is it's own **Sub-Application** loaded on demand by the core Alain.xyz Application.

The main application starts by querying the backend for a given portfolio item bound by a permalink:

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

If it hits a match, we'll receive meta information related to the entry, which is then used to load the `default` export of the module file defined in `main`. Every default export is assumed to be a React component by the main app, which takes in it's corresponding meta information.

This lends itself to allowing for tons of reuse. Every book can either be its own app or build off the **Book** sub-application, every blog post can build off the **BlogPost** subapp, even the portfolio view and about pages are their own apps!

```tsx
// You can load any package from either the subapp or from the main Alain.xyz App.
import React from 'react';
import { Icon } from 'alain-xyz';
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
[david-url]: https://david-dm.org/alaingalvan/alain.xyz?path=packages/portfolio
[david-img]: https://david-dm.org/alaingalvan/alain.xyz.svg?path=packages/portfolio&style=flat-square
[david-dev-url]: https://david-dm.org/alaingalvan/alain.xyz?path=packages/portfolio#info=devDependencies
[david-dev-img]: https://david-dm.org/alaingalvan/alain.xyz/dev-status.svg?path=frontend&style=flat-square
