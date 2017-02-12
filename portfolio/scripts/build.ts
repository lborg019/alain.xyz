/**
 * 🔳 Alain.xyz Builder
 * Compiles the portfolio and populates it in MongoDB. 
 * Each portfolio item has a unique Build step.
 */

import { red, cyan, green, gray } from 'chalk';
import * as buildScripts from './tasks';

(async () => {

  // Start Build Process
  console.log(
    cyan('🔳 Alain.xyz Builder v0.4.0')
  )

  // Run each task
  var scripts = Object.values(buildScripts);
  for (var script of scripts) {
    console.log(`\n👟 ${gray('Running Task...')}\n`);
    await script()
    .then( res => {
      console.log(`\n✔️️ ${green('Finished task!')}\n`);
    })
    .catch(err => {
      console.log(`\n❌ ${red('Failed task!')}\n`);
      console.error(err);
    });
    
    
  }
  console.log('\n💮 ' + gray(`Finished processing ${scripts.length} tasks!\n`));

  // Close process
  process.exit();

})();

