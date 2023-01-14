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
    pool: {
      min: 0,
      max: 50,
      propagateCreateError: false,
    },
  },
};