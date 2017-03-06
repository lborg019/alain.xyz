import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Request, Response } from 'express';
import { StaticRouter } from 'react-router';
import { template, render } from 'rapscallion';
import * as React from 'react';
import * as serialize from 'serialize-javascript';

import { database } from './db';
import { Redirect, PortfolioItem } from './schema';

import App from '../../frontend/src/app';
import reducers from '../../frontend/src/store/reducers';


/**
 * Queries Database for portfolio items
 * Sends portfolio items
 */
export function renderPage(req: Request, res: Response) {

  let { originalUrl } = req;

  // Set page meta tags

  database.then(async db => {

    let portfolioCol = db.collection('portfolio');

    let redirectCol = db.collection('redirect');

    // Redirect (Max 1 times)
    let getRedirects = from => redirectCol
      .find<Redirect>({ from })
      .limit(1)
      .toArray()
      .catch(err => console.error(err));

    let redirects = await getRedirects(originalUrl);

    if (redirects && redirects.length > 0) {
      originalUrl = redirects[0].to;
    }

    // Query Portfolio and grab 10 items.
    let portfolio = await portfolioCol
      .find<PortfolioItem>({ permalink: originalUrl })
      .limit(MAXITEMS)
      .toArray()
      .catch(err => console.error(err));

    page(req, res, portfolio || []);

  });
}

/**
 * Render Page with Rapscallion
 */
function page(req: Request, res: Response, data: PortfolioItem[]) {

  let meta: Meta = data.length === 1
    ? data[0]
    : META;

  const state = {
    portfolio: data,
    subapp: data.find(subapp => subapp.permalink === req.originalUrl)
  };

  const store = createStore(reducers, state, compose(applyMiddleware(thunk)));


  // React Router
  const context: any = {};

  const app = (
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        {App}
      </StaticRouter>
    </Provider>
  );


  // context.url will contain the URL to redirect to if a <Redirect> was used
  if (context.url) {

    res.writeHead(302, {
      Location: context.url
    });

    return res.end();

  } else {

    const componentRenderer = render(app);
    const responseRenderer = template`<!--
            ..\`
          ......\`
        ..........\`
      ......  \`.....\`
    ......      \`.....\`
  ......          \`.....\`
 .....              \`.....\`
                      \`.....\`
                        \`.....\`
                          \`.....\`
 Alain.xyz
 Built with <3 in React and TypeScript
 Check out the source @ https://github.com/alaingalvan/alain.xyz
-->
<!doctype html>
<html>

<head>
  <meta charset="UTF-8">
  <title>${meta.title}</title>
  <!--Search Engines-->
  <meta name="author" content="${meta.authors[0]}"/>
  <meta name="description" content="${meta.description}"/>
  <meta name="keywords" content="${meta.tags.reduce((prev, cur) => prev + ' ' + cur, '')}"/>
  <!--Twitter-->
  <meta name="twitter:card" content="summary"/>
  <meta name="twitter:site" content="@Alainxyz"/>
  <meta name="twitter:title" content="${meta.title}"/>
  <meta name="twitter:description" content="${meta.description}"/>
  <meta name="twitter:image" content="https://alain.xyz${meta.cover}"/>
  <!--Facebook-->
  <meta property="og:title" content="${meta.title}"/>
  <meta property="og:description" content="${meta.description}"/>
  <meta property="og:url" content="https://alain.xyz${meta.permalink}"/>
  <meta property="og:site_name" content="Alain.xyz"/>
  <meta property="og:image" content="https://alain.xyz${meta.cover}"/>
  <meta property="fb:app_id" content="1404536383143308"/>
  <!--Icons/Mobile-->
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
  <meta name="theme-color" content="#21252b">
  <link rel="manifest" href="/assets/manifest.webmanifest">
  <link rel="shortcut icon" href="/assets/brand/icon.ico"/>
  <link rel="stylesheet" href="/assets/build/main.min.css"/>
</head>

<body>
  <div id="app">${app}</div>

  <!--Load App-->
  <script>
    window._initialState=${serialize(state)};
  </script>
  <script src="/assets/build/system.min.js"></script>
  <script src="/assets/build/vendor.min.js"></script>
  <script src="/assets/build/main.min.js"></script>
</body>

</html>
`
    responseRenderer
      .toStream()
      .pipe(res);

  }


}

const META = {
  permalink: '/',
  title: 'Alain Galván | Graduate Graphics Researcher @ FIU',
  description: 'The portfolio of Alain Galván, Graduate Graphics Researcher @ Florida International University.',
  cover: '/assets/brand/website-screenshot.jpg',
  tags: ['alain', 'galvan', 'miami', 'graphics', 'programmer', 'artist', 'indie', 'phd', 'tutorial', 'mathematics', 'rendering', 'demo', '3D', 'realtime', 'shader', 'raytracing', 'webgl', 'glsl'],
  authors: ['Alain Galvan']
};

const MAXITEMS = 10;

type Meta = {
  title: string,
  description: string,
  cover: string
  tags: string[],
  permalink: string,
  authors: string[]
}