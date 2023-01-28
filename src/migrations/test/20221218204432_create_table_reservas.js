exports.up = (knex) => knex.schema.createTable('reservas', (t) => {
  t.increments('id').primary();
  t.integer('cliente_id').references('id').inTable('clientes').notNull();
  t.integer('aula_id').references('id').inTable('aulas').notNull();
  t.string('aula_nome').notNull();
  t.string('aula_data').notNull();
  t.string('aula_horario').notNull();
  t.string('aula_instrutor').notNull();
  t.string('aula_local').notNull();
  t.string('aula_duracao').notNull();
  t.string('aula_nivel').notNull();
  t.string('aula_descricao');
  t.string('aula_image').notNull();
});

exports.down = (knex) => knex.schema.dropTable('reservas');
