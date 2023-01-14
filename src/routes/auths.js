const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');

const secret = 'smartgym123';

module.exports = (app) => {
  const signin = (req, res, next) => {
    app.services.cliente.findOne({ nif: req.body.nif })
      .then((cliente) => {
        if (!cliente) throw new ValidationError('Autenticação Inválida! #2');
        if (bcrypt.compareSync(req.body.password, cliente.password)) {
          const payload = {
            id: cliente.id,
            name: cliente.name,
            nif: cliente.nif,
          };
          const token = jwt.encode(payload, secret);
          res.status(200).json({ token });
        } else throw new ValidationError('Autenticação Inválida!');
      }).catch((err) => next(err));
  };

  return { signin };
};
