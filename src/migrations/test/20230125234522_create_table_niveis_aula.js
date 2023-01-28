exports.up = (knex) => knex.schema.createTable('niveis', (t) => {
  t.increments('id').primary();
  t.string('nivel').notNull();
});

exports.down = (knex) => knex.schema.dropTable('niveis');
