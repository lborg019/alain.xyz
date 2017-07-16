import * as RSS from 'rss';
import { database } from '../../../backend/src/db';
import { writeFileSync } from 'fs';
import { join } from 'path';

export async function rssFeed() {
  let config = {
    title: 'Alain.xyz',

    description: 'The portfolio of Alain Galván, Engineer @ Marmoset.',

    generator: 'https://alain.xyz/',

    feed_url: 'https://alain.xyz/rss',

    site_url: 'https://alain.xyz/',

    image_url: 'https://alain.xyz/assets/',

    docs: 'https://alain.xyz/',

    managingEditor: 'Alain Galvan',

    webMaster: 'Alain Galvan',

    copyright: 'Copyright Alain Galvan All Rights Reserved.',

    language: 'English',

    categories: [
      'vulkan',
      'c++',
      'programming',
      'graphics',
      'opengl',
      'metal',
      'directx',
      'research',
      'algorithms'
    ],

    pubDate: new Date(),

    ttl: 2400
  };

  let rss = new RSS(config);

  // Populate RSS Feed
  let data = await new Promise<any[]>((res, rej) => database
    .then(db => {
      var col = db.collection('portfolio');

      let data = col.find({})
        .limit(30)
        .sort({
          datePublished: -1
        })
        .toArray((err, data) => {
          if (err || data.length === 0)
            return rej();
          res(data);
        });
    }));

  for (var item of data) {
    rss.item({
        title: item.title,
        description: item.description,
        url: 'https://alain.xyz' + item.permalink,
        date: item.datePublished
    });
  }

  // Generate file
  let xml = rss.xml();

  // Place in `frontend/assets/rss.xml`
  let p = join('..', 'frontend', 'assets', 'rss.xml')
  writeFileSync(p, xml);
}