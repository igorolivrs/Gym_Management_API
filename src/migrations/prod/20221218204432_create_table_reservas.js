exports.up = (knex) => knex.schema.createTable('reservas', (t) => {
  t.increments('id').primary();
  t.integer('cliente_id').references('id').inTable('clientes').notNull();
  t.integer('aula_id').references('id').inTable('aulas').notNull();
});

exports.down = (knex) => knex.schema.dropTable('reservas');
