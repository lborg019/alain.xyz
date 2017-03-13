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

  for (var i = 0; i < scripts.length; i++) {
    console.log(`\n👟 ${gray(`Running Task (${i + 1}/${scripts.length})...`)}\n`);
    await scripts[i]()
    .then( res => {
      console.log(`\n✔️️ ${green(`Finished Task (${i + 1}/${scripts.length})!`)}\n`);
    })
    .catch(err => {
      console.log(`\n❌ ${red(`Failed Task (${i + 1}/${scripts.length})!`)}\n`);
      console.error(err);
    });
    
    
  }
  console.log('\n💮 ' + gray(`Finished processing ${scripts.length} tasks!\n`));

  // Close process
  process.exit();

})();

