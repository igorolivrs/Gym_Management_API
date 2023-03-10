const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (userId) => {
    return app.db('reservas').where({ cliente_id: userId });
  };

  const findOne = (filter = {}) => {
    return app.db('reservas').where(filter).first();
  };

  const save = async (req) => {
    const reserva = req.body;
    // console.log(req.user);
    if (!reserva.cliente_id) throw new ValidationError('Cliente ID é um atributo obrigatório');
    if (!reserva.aula_id) throw new ValidationError('Aula ID é um atributo obrigatório');

    const reservaAulaIdDb = await findOne({ aula_id: reserva.aula_id });
    if (reservaAulaIdDb) throw new ValidationError('Aula já reservada');

    return app.db('reservas').insert(reserva, '*');
  };

  const remove = async (id) => {
    return app.db('reservas')
      .where({ id })
      .del();
  };

  return {
    findAll, findOne, save, remove,
  };
};
