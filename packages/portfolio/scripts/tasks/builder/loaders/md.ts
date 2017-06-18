import markademic from 'markademic';
import { join } from 'path';
import { readFileSync } from 'fs';

export let md = {
    test: { file: /\.md$/ },
    loader: async foil => ({
      ...foil,
      data: markademic({
        input: readFileSync(foil.file).toString(),
        rerouteLinks: (link) => join(foil.permalink, link)
      })
    })
  }