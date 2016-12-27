/**
 * 🔳 Alain.xyz Builder
 * Compiles the portfolio and populates it in MongoDB. 
 * Each portfolio item has a unique Build step.
 */

import { cyan, green } from 'chalk';
import * as buildScripts from './tasks';

(async () => {

  // Start Build Process
  console.log(
    cyan('🔳 Alain.xyz Builder v0.4.0')
  )

  // Run each task
  var scripts = Object.values(buildScripts);
  for (var script of scripts) {
    console.log('Running Task!\n');
    await script();
    console.log('Finished task!\n')
  }
  console.log(green(`Finished processing ${scripts.length} tasks!`));

  // Close process
  process.exit();

})();

