[![Website Screenshot][website-img]][website-url]

# ![Icon](assets/brand/icon.ico) [Alain.xyz](https://alain.xyz)

![Release][release-img] [![License][license-img]][license-url] [![Dependency Status][david-img]][david-url] [![devDependency Status][david-dev-img]][david-dev-url]

My personal website built on top of [TypeScript 2.0](http://www.typescriptlang.org/), [React 15.3](https://facebook.github.io/react/), [WebPack 2.1](https://webpack.github.io/), [PostCSS](https://github.com/postcss/postcss). Follow the development on [Trello](https://trello.com/b/CVu8yxlf/alain-xyz).

It's basically a portfolio system that works by dynamically loading portfolio components with SystemJS. The following repo contains the core of the application. (Redux store, router, core components, etc.) 

Check out the [blog post where I detail design decisions here](https://alain.xyz/blog/the-making-of-alain-xyz).

A few of the projects that influenced the design of this app were:

- [Wordpress Calypso](https://github.com/Automattic/wp-calypso)
- [TypeScript Samples Imageboard](https://github.com/Microsoft/TypeScriptSamples/tree/master/imageboard)
- [ReactJS Essentials by Artemij Fedosejev](https://github.com/fedosejev/react-essentials)

## App File Structure

```bash
|- src/                 # App Source
    |- components/      # Components
        |- hero.tsx
        |- ...
|- assets/              # Static Content
|- package.json
```

## Setup

Make sure to have Node, then:

```bash
# Starting Off Development
npm install         # Install server dependencies
npm run develop     # Start developing if you need to
npm run build       # Build the app for production
```

## Design decisions

### Webpack to Manage Dependencies

I'm using Webpack 2 to take advantage of Webpack's new tree shaking algorithm (get rid of dead code from your build!), as well as to manage dependencies/bundling/building.

### React 15.3 as the Front End Framework

React brought functional programming to the forefront of web views. Before we worked with static content, then made domain specific languages like JSP or Jade, functional views are the next step up!

### PostCSS as the CSS Processor

I'm using PostCSS to take advantage of [CSS4 features with CSSNext](http://cssnext.io/) as well as simply as an exercise in something that isn't SCSS.

## Special Thanks

- [LocalFont.com](http://www.localfont.com/) for making it easy to set up custom fonts.
- [IcoMoon.io](https://icomoon.io/) - For providing the icon svgs.

[website-img]: assets/brand/website-screenshot.png
[website-url]: https://alain.xyz
[release-img]: https://img.shields.io/badge/release-0.4.0-4dbfcc.svg?style=flat-square
[license-img]: http://img.shields.io/:license-mit-blue.svg?style=flat-square
[license-url]: https://opensource.org/licenses/MIT
[david-url]: https://david-dm.org/alaingalvan/alain.xyz?path=frontend
[david-img]: https://david-dm.org/alaingalvan/alain.xyz.svg?path=frontend&style=flat-square
[david-dev-url]: https://david-dm.org/alaingalvan/alain.xyz?path=frontend#info=devDependencies
[david-dev-img]: https://david-dm.org/alaingalvan/alain.xyz/dev-status.svg?path=frontend&style=flat-square
