exports.seed = (knex) => {
  return knex('niveis').del()
    .then(() => knex('niveis').insert([
      { id: 1, nivel: 'Leve' },
      { id: 2, nivel: 'Moderado' },
      { id: 3, nivel: 'Intenso' },
    ]));
};
