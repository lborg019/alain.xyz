import * as RSS from 'rss';
import { database } from '../../../backend/src/db';
import { writeFileSync } from 'fs';
import { join } from 'path';

export async function rssFeed() {
  console.log('📻 Alain.xyz RSS Feeds \n');

  let config = {
    title: 'Alain.xyz',

    description: 'The portfolio of Alain Galván, Engineer @ Marmoset.',

    generator: 'https://alain.xyz/',

    feed_url: 'https://alain.xyz/rss',

    site_url: 'https://alain.xyz/',

    image_url: 'https://alain.xyz/assets/alaingalvan.jpg',

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

    ttl: 1200
  };

  let rss = new RSS(config);

  // Populate RSS Feed
  let alainxyzData = await new Promise<any[]>((res, rej) => database
    .then(db => {
      var col = db.collection('portfolio');

      let data = col.find({
        datePublished: { $lte: new Date() }
      })
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

  for (var item of alainxyzData) {
    rss.item({
      title: item.title,
      description: item.description,
      url: 'https://alain.xyz' + item.permalink,
      date: item.datePublished,
      enclosure: {
        url: 'https://alain.xyz' + item.cover,
        file: 'https://alain.xyz' + item.cover
      }
    });
  }

  // Generate file
  let xml = rss.xml();

  // Place in `frontend/assets/rss.xml`
  let p = join('..', 'frontend', 'assets', 'rss.xml')
  try {
    writeFileSync(p, xml);
    console.log('RSS feed successfully generated. \n');
  }
  catch (e) {
    console.error('Could not generate RSS Feeds! \n');
  }
}