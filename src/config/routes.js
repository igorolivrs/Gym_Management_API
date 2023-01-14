module.exports = (app) => {
  app.route('/auth/signin').post(app.routes.auths.signin);
  app.route('/auth/signup').post(app.routes.clientes.create);

  app.route('/clientes')
    .all(app.config.passport.authenticate())
    .get(app.routes.clientes.findAll)
    .post(app.routes.clientes.create);

  app.route('/clientes/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.clientes.get)
    .put(app.routes.clientes.update)
    .delete(app.routes.clientes.del);

  app.route('/aulas')
    .all(app.config.passport.authenticate())
    .get(app.routes.aulas.findAll)
    .post(app.routes.aulas.create);

  app.route('/aulas/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.aulas.get)
    .put(app.routes.aulas.update)
    .delete(app.routes.aulas.del);

  app.route('/reservas')
    .all(app.config.passport.authenticate())
    .get(app.routes.reservas.findAll)
    .post(app.routes.reservas.create);

  app.route('/reservas/:id')
    .all(app.config.passport.authenticate())
    .delete(app.routes.reservas.del);
};
