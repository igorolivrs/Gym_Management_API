exports.up = (knex) => knex.schema.createTable('aulas', (t) => {
  t.increments('id').primary();
  t.string('nome_aula').notNull();
  t.string('data').notNull();
  t.string('horario').notNull();
  t.string('instrutor').notNull();
  t.string('local').notNull();
  t.string('duracao').notNull();
  t.string('nivel').notNull();
  t.string('descricao');
  t.string('image');
});

exports.down = (knex) => knex.schema.dropTable('aulas');
