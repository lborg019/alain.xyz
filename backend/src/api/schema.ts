// schema.js
import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql';

import { database } from '../db';

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
    }
  })
});

export default schema;