const { graphqlHTTP } = require('express-graphql');
const app = require('express')();
const pg = require('pg');

const { nodeEnv } = require('./util');
const ncSchema = require('../schema');
const pgConfig = require('../config/pg')[nodeEnv];

const pgPool = new pg.Pool(pgConfig);

console.log(`Running in ${nodeEnv} mode...`);

app.use('/graphql', graphqlHTTP({
  schema: ncSchema,
  graphiql: true,
  context: { pgPool },
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
