# [Alain.xyz](https://alain.xyz) Backend

![Release][release-img] [![License][isc-img]][isc-url] [![Dependency Status][david-img]][david-url] [![devDependency Status][david-dev-img]][david-dev-url]

An intelligent portfolio backend build on top of [Node 6.3](https://nodejs.org/en/), [TypeScript 2.0](http://www.typescriptlang.org/), [Express 4](https://expressjs.com/), and [MongoDB 3.2](http://mongodb.org/).

Give it a repository of portfolio items and a few functions to describe what to do with those items, and it will populate a database for an *SPA* or *Web Service*.

## API

- `api/v1/posts` - **Get a list of portfolio posts.**

Depending on the response, the SPA has the option of rendering a given string of HTML, loading a mp3 file or even loading a javascript file (to say fetch a React Component from the backend).

```ts
interface PostAPIRequest {
    permalink: string,
    content: boolean,
    tags: string[],
    skip: number,
    limit: number
}

interface PostAPIResponse {
  [index: number]: {
    permalink: string,
    title: string,
    description: string,
    content: string,
    tags: string[]
  }
}
```

Supports:

- Apps
- Games
- Music
- Movies
- Books
- Blogposts
- Courses

## Setup

Make sure to have Node, then:

```bash
# Starting Off Development
npm install         # Install server dependencies
npm run develop     # Start developing if you need to
npm run build       # Populate the database
npm run production  # Start the app perpetually in production mode.
```

## Roadmap

1. Add Serverside Rendering of the React Frontend similar to [this post in Redux's Docs.](http://redux.js.org/docs/recipes/ServerRendering.html)

2. Switch to Postgres/GraphQL to prevent the need of revising API endpoints.

3. Create a CLI for portfolio watching, and adding meta information on a new post, which communicates with an underlining portfolio api. 

4. When visiting a permalink for the first time, for bots, change the meta tags of the index.html to reflect that permalink's portfolio data.

[website-url]: https://alain.xyz
[release-img]: https://img.shields.io/badge/release-0.3.0-4dbfcc.svg?style=flat-square
[isc-img]: http://img.shields.io/:license-isc-blue.svg?style=flat-square
[isc-url]: https://opensource.org/licenses/ISC
[david-url]: https://david-dm.org/alaingalvan/alain.xyz-backend
[david-img]: https://david-dm.org/alaingalvan/alain.xyz-backend.svg?style=flat-square
[david-dev-url]: https://david-dm.org/alaingalvan/alain.xyz-backend#info=devDependencies
[david-dev-img]: https://david-dm.org/alaingalvan/alain.xyz-backend/dev-status.svg?style=flat-square
