const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => app.db('clientes').where(filter).select(['id', 'name', 'email', 'nif']);

  const findOne = (filter = {}) => {
    return app.db('clientes').where(filter).first();
  };

  const getPasswordHash = (pass) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pass, salt);
  };

  const save = async (cliente) => {
    if (!cliente.name) throw new ValidationError('Name é um atributo obrigatório');
    if (!cliente.email) throw new ValidationError('Email é um atributo obrigatório');
    if (!cliente.nif) throw new ValidationError('NIF é um atributo obrigatório');
    if (!cliente.password) throw new ValidationError('Password é um atributo obrigatório');

    const clientesEmailDb = await findOne({ email: cliente.email });
    if (clientesEmailDb) throw new ValidationError('Email duplicado na Base de Dados');

    const clientesNifDb = await findOne({ nif: cliente.nif });
    if (clientesNifDb) throw new ValidationError('NIF duplicado na Base de Dados');

    const newCliente = { ...cliente };
    newCliente.password = getPasswordHash(cliente.password);
    return app.db('clientes').insert(newCliente, ['id', 'name', 'email', 'nif']);
  };

  const remove = (id) => {
    return app.db('clientes')
      .where({ id })
      .del();
  };

  const update = async (id, cliente) => {
    return app.db('clientes')
      .where({ id })
      .update(cliente, '*');
  };

  return {
    findAll, save, findOne, remove, update,
  };
};
