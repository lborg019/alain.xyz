import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Request, Response } from 'express';
import { StaticRouter } from 'react-router';
import { template, render } from 'rapscallion';
import * as React from 'react';
import * as serialize from 'serialize-javascript';

import { database } from './db';
import { App, reducers } from 'alain-xyz-frontend';

/**
 * Prerenders a given page with React.
 */
export function renderPage(req: Request, res: Response) {

  // Set page meta tags
  let meta = {
    permalink: '/',
    title: 'Alain Galván | Graduate Graphics Researcher @ FIU',
    description: 'The portfolio of Alain Galván, Graduate Graphics Researcher @ Florida International University.',
    cover: '/assets/brand/website-screenshot.jpg'
  };

  // Query portfolio
  let query = {
    permalink: req.originalUrl
  };

  database.then((db) => {
    db.collection('portfolio').find(query)
      .limit(1)
      .toArray((errCol, data) => {
        if (!errCol && data.length >= 1)
          meta = data[0];

        page(req, res, meta, data);
      });
  });
}

function page(req: Request, res: Response, meta: Meta, data) {

  const state = {};

  const store = createStore(reducers, state);


  // React Router
  const context: any = {};
  const app = (
    <Provider>
      <StaticRouter location={req.url} context={context}>
        {App}
      </StaticRouter>
    </Provider>
  );

  let responseRenderer = template`<!--
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
  <meta name="author" content="${meta.author}"/>
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
  <meta property="og:url" content="https://Alain.xyz${meta.permalink}"/>
  <meta property="og:site_name" content="Alain.xyz"/>
  <meta property="og:image" content="https://alain.xyz${meta.cover}"/>
  <meta property="fb:app_id" content="1404536383143308"/>
  <!--Icons/Mobile-->
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
  <link rel="shortcut icon" href="/assets/brand/icon.ico"/>
  <link rel="stylesheet" href="/assets/build/main.min.css"/>
</head>

<body>
  <div id="app">
    ${app}
  </div>

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
    responseRenderer.toStream().pipe(res);
}

type Meta = {
  title: string,
  description: string,
  cover: string
  tags: string[],
  permalink: string,
  author: string
}