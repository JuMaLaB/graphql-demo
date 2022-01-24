const {
  GraphQLObjectType,
  GraphQLInt,
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'TotalVotes',

  fields: () => {
    return {
      up: { type: GraphQLInt },
      down: { type: GraphQLInt },
    };
  },
});
