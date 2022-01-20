/* eslint-disable quotes */
/* eslint-disable arrow-body-style */
module.exports = (pgPool) => {
  return {
    getUser(apiKey) {
      return pgPool.query(`select * from users where api_key = $1`, [apiKey])
        .then((result) => {
          return result.rows[0];
        });
    },
  };
};
