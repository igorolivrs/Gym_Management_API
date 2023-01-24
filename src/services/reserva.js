const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (userId) => {
    return app.db('reservas').where({ cliente_id: userId });
  };

  const save = (req) => {
    const reserva = req.body;
    // console.log(req.user);
    if (!reserva.cliente_id) throw new ValidationError('ID Cliente é um atributo obrigatório');
    if (!reserva.aula_id) throw new ValidationError('ID Aula é um atributo obrigatório');

    return app.db('reservas').insert(reserva, '*');
  };

  const remove = (id) => {
    return app.db('reservas')
      .where({ id })
      .del();
  };

  return { findAll, save, remove };
};
