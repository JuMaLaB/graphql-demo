// Import type helpers from graphql-js
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');

const UserType = require('./types/user');

// The root query type is where in the data graph
// we can start asking questions
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',

  fields: {
    hello: {
      type: GraphQLString,
      description: 'The *mandatory* hello world example, GraphQL style',
      resolve: () => 'world !!!',
    },
    user: {
      type: UserType,
      description: 'The current user identified by an api key',
      args: {
        key: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: () => {
        // Read user information from database
      },
    },
  },
});

const ncSchema = new GraphQLSchema({
  query: RootQueryType,
  // mutation: ...
});

module.exports = ncSchema;
