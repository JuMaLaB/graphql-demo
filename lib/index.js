/* eslint-disable global-require */
const assert = require('assert');
const app = require('express')();
const { graphqlHTTP } = require('express-graphql');
const pg = require('pg');
const { MongoClient, Logger } = require('mongodb');
const DataLoader = require('dataloader');

const { nodeEnv } = require('./util');
const ncSchema = require('../schema');
const pgConfig = require('../config/pg')[nodeEnv];
const mConfig = require('../config/mongo')[nodeEnv];

const pgPool = new pg.Pool(pgConfig);
const pgdb = require('../database/pgdb')(pgPool);

MongoClient.connect(mConfig.url, (err, mPool) => {
  assert.equal(err, null);

  const mdb = require('../database/mdb')(mPool);

  console.log(`Running in ${nodeEnv} mode...`);
  Logger.setLevel('debug');
  Logger.filter('class', ['Server']);

  app.use('/graphql', (req, res) => {
    const loaders = {
      usersByIds: new DataLoader((keys) => {
        return pgdb.getUsersByIds(keys);
      }),
      usersByApiKeys: new DataLoader((keys) => {
        return pgdb.getUsersByApiKeys(keys);
      }),
      namesForContestIds: new DataLoader((keys) => {
        return pgdb.getNamesForContestIds(keys);
      }),
      contestsForUserIds: new DataLoader((keys) => {
        return pgdb.getContestsForUserIds(keys);
      }),
      totalVotesByNameIds: new DataLoader((keys) => {
        return pgdb.getTotalVotesByNameIds(keys);
      }),
      mdb: {
        usersByIds: new DataLoader((keys) => {
          return mdb.getUsersByIds(keys);
        }),
      },
    };
    graphqlHTTP({
      schema: ncSchema,
      graphiql: true,
      context: { loaders },
    })(req, res);
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
