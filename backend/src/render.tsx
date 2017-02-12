import { Request, Response } from 'express';
import { database } from './db';

/**
 * Prerenders a given page with React.
 */
export function renderPage(req: Request, res: Response) {
  let meta = {
    permalink: '/',
    title: 'Alain Galvan | Graphics Research Assistant @ FIU',
    description: 'The portfolio of Alain Galvan, Graphics Research Assistant @ Florida International University.',
    cover: '/assets/brand/website-screenshot.jpg'
  };

  let query = {
    permalink: req.originalUrl
  };

  database.then((db) => {
    db.collection('portfolio').find(query)
      .limit(1)
      .toArray((errCol, data) => {
        if (!errCol && data.length >= 1)
          meta = data[0];

        page(meta, req, res);
      });
  });
}

function page(meta, req: Request, res: Response) {

  // This context object contains the results of the render
  const context: any = {};

  let markup = 
  `<div style="display: flex; width: 100vw; height: 100vh">
  <svg viewBox="0 0 160 112" class="ag-loading">
    <path d="M8,72l50.3-50.3c3.1-3.1,8.2-3.1,11.3,0L152,104"></path>
  </svg>
</div>`;

    res.contentType('text/html').send(
      `<!--
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
  <meta name="author" content="Alain Galvan"/>
  <meta name="description" content="${meta.description}"/>
  <meta name="keywords" content="shadertoy, shader toy, fractals, demoscene, computer graphics, mathematics, rendering, demo, 3D, realtime, shader, raytracing, webgl, glsl"/>
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
  <link rel="stylesheet" href="/assets/main.min.css"/>
</head>

<body>
  <div id="app">
    ${markup}
  </div>

  <!--Load App-->
  <script src="/assets/vendor.min.js"></script>
  <script src="/assets/main.min.js"></script>
</body>

</html>
`);
}