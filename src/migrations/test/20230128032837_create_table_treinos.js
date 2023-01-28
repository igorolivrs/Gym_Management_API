exports.up = (knex) => knex.schema.createTable('treinos', (t) => {
  t.increments('id').primary();
  t.integer('cliente_id').references('id').inTable('clientes').notNull();
  t.string('musculo').notNull();
  t.string('musculo2');
  t.string('musculo3');
  t.string('musculo4');
  t.string('exercicio').notNull();
  t.string('exercicio2');
  t.string('exercicio3');
  t.string('exercicio4');
  t.string('series').notNull();
  t.string('series2');
  t.string('series3');
  t.string('series4');
  t.string('repeticoes').notNull();
  t.string('repeticoes2');
  t.string('repeticoes3');
  t.string('repeticoes4');
  t.string('descanso').notNull();
  t.string('descanso2');
  t.string('descanso3');
  t.string('descanso4');
  t.string('image');
});

exports.down = (knex) => knex.schema.dropTable('treinos');
