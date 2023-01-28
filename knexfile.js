/* eslint-disable linebreak-style */
module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: '6003',
      user: 'smartgym',
      password: 'smartgym',
      database: 'smartgym',
    },
    debug: false,
    migrations: {
      directory: 'src/migrations/test',
    },
    seeds: {
      directory: 'src/seeds',
    },
    pool: {
      min: 0,
      max: 50,
      propagateCreateError: false,
    },
  },
  prod: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: '6002',
      user: 'smartgymprod',
      password: 'smartgymprod',
      database: 'smartgymprod',
    },
    debug: false,
    migrations: {
      directory: 'src/migrations/prod',
    },
    seeds: {
      directory: 'src/seeds',
    },
    pool: {
      min: 0,
      max: 50,
      propagateCreateError: false,
    },
  },
};
