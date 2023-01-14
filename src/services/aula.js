const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => app.db('aulas').where(filter).select(['id', 'nome_aula', 'data', 'instrutor', 'local', 'duracao', 'nivel', 'descricao']);

  const findOne = (filter = {}) => {
    return app.db('aulas').where(filter).first();
  };

  const save = async (aula) => {
    if (!aula.nome_aula) throw new ValidationError('Nome é um atributo obrigatório');
    if (!aula.data) throw new ValidationError('Data é um atributo obrigatório');
    if (!aula.instrutor) throw new ValidationError('Nome do instrutor é um atributo obrigatório');
    if (!aula.local) throw new ValidationError('Local é um atributo obrigatório');
    if (!aula.duracao) throw new ValidationError('Duração é um atributo obrigatório');
    if (!aula.nivel) throw new ValidationError('Nivel é um atributo obrigatório');

    const aulasDataDb = await findOne({ data: aula.data });
    if (aulasDataDb) throw new ValidationError('Data duplicada na Base de Dados');

    return app.db('aulas').insert(aula, '*');
  };

  const remove = (id) => {
    return app.db('aulas')
      .where({ id })
      .del();
  };

  const update = async (id, aula) => {
    return app.db('aulas')
      .where({ id })
      .update(aula, '*');
  };

  return {
    findAll, save, findOne, remove, update,
  };
};
