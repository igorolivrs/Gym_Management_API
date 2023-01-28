const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (userId) => {
    return app.db('treinos').where({ cliente_id: userId });
  };

  const findOne = (filter = {}) => {
    return app.db('treinos').where(filter).first();
  };

  const save = async (req) => {
    const treino = req.body;
    // console.log(req.user);
    if (!treino.cliente_id) throw new ValidationError('ID Cliente é um atributo obrigatório');
    if (!treino.musculo) throw new ValidationError('Músculo é um atributo obrigatório');
    if (!treino.exercicio) throw new ValidationError('Exercício é um atributo obrigatório');
    if (!treino.series) throw new ValidationError('Séries é um atributo obrigatório');
    if (!treino.repeticoes) throw new ValidationError('Repetições é um atributo obrigatório');
    if (!treino.descanso) throw new ValidationError('Descanso é um atributo obrigatório');

    return app.db('treinos').insert(treino, '*');
  };

  const update = async (id, treino) => {
    return app.db('treinos')
      .where({ id })
      .update(treino, '*');
  };

  const remove = (id) => {
    return app.db('treinos')
      .where({ id })
      .del();
  };

  return {
    findAll, findOne, save, update, remove,
  };
};
