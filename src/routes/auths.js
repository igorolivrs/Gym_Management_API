const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');

const secret = 'smartgym123';

module.exports = (app) => {
  const router = express.Router();

  router.post('/signin', (req, res, next) => {
    app.services.cliente.findOne({ nif: req.body.nif })
      .then((cliente) => {
        if (!cliente) throw new ValidationError('NIF Inválido!');
        if (bcrypt.compareSync(req.body.password, cliente.password)) {
          const payload = {
            id: cliente.id,
            name: cliente.name,
            email: cliente.email,
            nif: cliente.nif,
          };
          const token = jwt.encode(payload, secret);
          res.status(200).json({ token });
        } else throw new ValidationError('Password Inválida!');
      }).catch((err) => next(err));
  });

  router.post('/signup', async (req, res, next) => {
    try {
      const result = await app.services.cliente.save(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
