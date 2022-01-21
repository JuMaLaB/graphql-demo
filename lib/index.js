const assert = require('assert');
const app = require('express')();
const { graphqlHTTP } = require('express-graphql');
const pg = require('pg');
const { MongoClient } = require('mongodb');
const DataLoader = require('dataloader');

const { nodeEnv } = require('./util');
const ncSchema = require('../schema');
const pgConfig = require('../config/pg')[nodeEnv];
const mConfig = require('../config/mongo')[nodeEnv];

const pgPool = new pg.Pool(pgConfig);
const pgdb = require('../database/pgdb')(pgPool);

MongoClient.connect(mConfig.url, (err, mPool) => {
  assert.equal(err, null);

  console.log(`Running in ${nodeEnv} mode...`);

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
    };
    graphqlHTTP({
      schema: ncSchema,
      graphiql: true,
      context: { mPool, loaders },
    })(req, res);
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
