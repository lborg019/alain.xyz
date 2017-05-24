import * as path from 'path';
import * as find from 'find';

/**
 * The following are various functions to get metadata 
 * for specific attributes of the portfolio system. 
 */


/**
 * Get an asset of a particular name (Whatever Format, from a given file path)
 */
export function getAsset(file: string, permalink: string, image = 'cover') {
  let dir = path.dirname(file);
  let c = find.fileSync(new RegExp(image + '\.(\w*)','mg'), dir);
  return (c.length > 0) ? path.join(permalink, path.relative(dir, c[0])).replace(/\\/g, '/') : '';
}

/**
 * Create a Permalink from a given path string.
 */
export function makePermalink(file: string, root: string) {
  let lastPath = (path.basename(file).match(/^index/)) ?
    path.dirname(file) :
    path.join(path.dirname(file), path.basename(file).replace(/\..+$/, ''));
  return path.join('/', path.relative(root, lastPath)).replace(/\\/g, '/');
}