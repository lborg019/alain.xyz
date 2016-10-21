/**
 * From this entry file, we compile everything in the portfolio and put it in the database.
 */

import compileSubapps from './build/subapp';
import buildBlog from './build/blog';
import buildArt from './build/art';
import buildMusic from './build/music';

var tasks = [
  compileSubapps,
  buildBlog
  //buildArt,
  //buildMusic
];

(async () => {
  for (var f of tasks) {
    console.log("Running Task!\n");
    await f();
  }
  console.log("Build Complete!");
  process.exit();
})();

