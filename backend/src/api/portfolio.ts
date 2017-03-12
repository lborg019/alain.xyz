import { Request, Response } from 'express';
import { database } from '../db';


/**
 * API Request Schema
 */
export type APISanitized = {
  // Skip the x number of posts
  skip: number,
  // Limit the number of posts to this amount
  limit: number,
  // Find post with this exact permalink
  permalink?: string | RegExp,
  // Find posts where these tags are present
  tags?: {
    $in: string[]
  }
}

/**
 * 
 */
export type APIRequest = {
  permalink?: string,
  data?: boolean,
  tags?: string[]
}

/**
 * Sanitizes the API's Input.
 */
function sanitize(reqBody): APISanitized {
  let {
    skip,
    limit,
    permalink,
    tags
  } = reqBody;

  let inRange = (v, a, b, def) => (v > a && v < b) ? v : def;
  let isArray = (arr) => (typeof arr === 'object' && typeof arr[0] === 'string') ? { $in: arr } : undefined;
  let makeRegexPath: ((s: string) => any) = (s) => {
    if (!(typeof s === 'string' && s.length < 256 && s.length > 0))
      return undefined;

    // Check if there's a * only at the end
    var validPathCheck = s.match(/\([^\0 !$`&*()+]\|\\\(\ |\!|\$|\`|\&|\*|\(|\)|\+\)\)\+/);
    if (validPathCheck !== null) {
      if (validPathCheck.length === 1 && s.match(/\*$/) !== null) {

        return new RegExp(s.replace('*', '\w*'));
      }
      return undefined;
    }
    return s;
  };

  try {
    let cleanReq: APISanitized = {
      skip: inRange(skip, 0, 1000, 0),
      limit: inRange(limit, 1, 30, 15),
      permalink: makeRegexPath(permalink),
      tags: isArray(tags)
    };

    // Remove Undefined Keys
    Object.keys(cleanReq).map((k) => (cleanReq[k] === undefined) ? delete cleanReq[k] : null);

    return cleanReq;
  }
  catch (e) {
    return {
      skip: 0,
      limit: 15
    }
  }


}

/**
 * An API Endpoint requesting blog posts.
 */
export default (req: Request, res: Response) => {

  // Get POST parameters
  let apiReq: APISanitized = sanitize(req.body);

  // Design Query
  let query = {
    ...apiReq,
    publishDate: { $lte: new Date() }
  };

  delete query.limit;
  delete query.skip;

  // Responses
  let failure = () => res.status(400).json({ error: "We can't find these posts. :(" });
  let success = msg => res.status(200).json(msg);

  database.then(
    db => {
    let c = db.collection('portfolio');

    let projection = {
      permalink: 1,
      title: 1,
      description: 1,
      cover: 1,
      meta: 1,
      tags: 1,
      data: 1,
      main: 1,
      publishDate: 1,
      lastUpdated: 1
    }

    let data = c.find(query, projection)
      .sort({
        publishDate: -1
      })
      .skip(apiReq.skip)
      .limit(apiReq.limit)
      .toArray((err, data) => {
        if (err || data.length === 0)
          return failure();
        success(data);
      });
  });
}