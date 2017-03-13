[![Website Screenshot][website-img]][website-url]

# ![Icon](packages/frontend/assets/brand/icon.ico) [Alain.xyz](https://alain.xyz)

![Release][release-img] [![License][license-img]][license-url] [![Dependency Status][david-img]][david-url]

My personal portfolio system build on top of the latest versions of:

- [Node](https://nodejs.org/en/)
- [TypeScript](http://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [MongoDB](http://mongodb.org/)
- [React](https://facebook.github.io/react/)
- [Redux](http://http://redux.js.org)
- [Lerna](https://lernajs.io/)
- [Webpack](https://webpack.js.org)
- [SystemJS](https://github.com/systemjs/systemjs)
- [PostCSS](https://github.com/postcss/postcss)

Check out the [blog post where I detail design decisions here](https://alain.xyz/blog/the-making-of-alain-xyz).

A few of the projects that influenced the design of this app were:

- [Wordpress Calypso](https://github.com/Automattic/wp-calypso)
- [TypeScript Samples Imageboard](https://github.com/Microsoft/TypeScriptSamples/tree/master/imageboard)
- [ReactJS Essentials by Artemij Fedosejev](https://github.com/fedosejev/react-essentials)

## Setup

```bash
# Use yarn or npm
# After installing lerna will handle the rest.
yarn
```

## How it Works

The site is comprised of 3 primary modules:

```bash
├─ daemon/    # Server Daemon
├─ backend/   # Express HTTP Server
├─ frontend/  # React Frontend Application
└─ portfolio/ # Personal Portfolio
```

[website-img]: brand/screenshots/branding-overview.png
[website-url]: https://alain.xyz
[release-img]: https://img.shields.io/badge/release-0.5.0-4dbfcc.svg?style=flat-square
[license-img]: http://img.shields.io/:license-mit-blue.svg?style=flat-square
[license-url]: https://opensource.org/licenses/MIT
[david-url]: https://david-dm.org/alaingalvan/alain.xyz
[david-img]: https://david-dm.org/alaingalvan/alain.xyz.svg?style=flat-square
[david-dev-url]: https://david-dm.org/alaingalvan/alain.xyz#info=devDependencies
[david-dev-img]: https://david-dm.org/alaingalvan/alain.xyz/dev-status.svg?style=flat-square
