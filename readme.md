[![Website Screenshot][website-img]][website-url]

# ![Icon](frontend/assets/brand/icon.ico) [Alain.xyz](https://alain.xyz)

![Release][release-img] [![License][license-img]][license-url] [![Dependency Status][david-img]][david-url]

My personal portfolio system build on top of the latest versions of:

- [Node](https://nodejs.org/en/)
- [TypeScript](http://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [MongoDB](http://mongodb.org/)
- [React](https://facebook.github.io/react/)
- [SystemJS](https://github.com/systemjs/systemjs)
- [PostCSS](https://github.com/postcss/postcss)

Check out the [blog post where I detail design decisions here](https://alain.xyz/blog/the-making-of-alain-xyz).

A few of the projects that influenced the design of this app were:

- [Wordpress Calypso](https://github.com/Automattic/wp-calypso)
- [TypeScript Samples Imageboard](https://github.com/Microsoft/TypeScriptSamples/tree/master/imageboard)
- [ReactJS Essentials by Artemij Fedosejev](https://github.com/fedosejev/react-essentials)

## Setup

### Docker

Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/install/).

```bash
# Install Docker and Docker Compose.
wget -qO- https://get.docker.com/ | sh
sudo apt-get -y install python-pip
sudo pip install docker-compose

# Begin setup
docker-compose up
```

### Local

```bash
npm i
npm run setup
npm start
```

## How it Works

The site is comprised of 3 primary modules:

```bash
# Http Server
|- backend/
  |- src/
  |- ...
# React App
|- frontend/
  |- src/
    |- components/
        |- hero.tsx
        |- ...
  |- assets/
  |- ...
# Repository of articles, talks, art, music
|- portfolio/
  |- 
```

### Backend

The backend application simply serves static files via http, and provides a REST API to view a list of portfolio items.

### Frontend

The frontend serves React views that can query the backend API for portfolio items the client is looking for and serve them.

### Portfolio

A repository composed of frontend modules for rendering views for different categories like articles, talks, music, etc.

[website-img]: brand/website-screenshot.jpg
[website-url]: https://alain.xyz
[release-img]: https://img.shields.io/badge/release-0.5.0-4dbfcc.svg?style=flat-square
[license-img]: http://img.shields.io/:license-mit-blue.svg?style=flat-square
[license-url]: https://opensource.org/licenses/MIT
[david-url]: https://david-dm.org/alaingalvan/alain.xyz
[david-img]: https://david-dm.org/alaingalvan/alain.xyz.svg?style=flat-square
[david-dev-url]: https://david-dm.org/alaingalvan/alain.xyz#info=devDependencies
[david-dev-img]: https://david-dm.org/alaingalvan/alain.xyz/dev-status.svg?style=flat-square
