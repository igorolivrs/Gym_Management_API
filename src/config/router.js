const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auths);

  const secureRouter = express.Router();

  secureRouter.use('/clientes', app.routes.clientes);
  secureRouter.use('/aulas', app.routes.aulas);
  secureRouter.use('/reservas', app.routes.reservas);
  secureRouter.use('/niveis', app.routes.niveis);
  secureRouter.use('/treinos', app.routes.treinos);

  app.use('/v1', app.config.passport.authenticate(), secureRouter);
};
