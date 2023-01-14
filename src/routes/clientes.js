module.exports = (app) => {
  const findAll = (req, res, next) => {
    app.services.cliente.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const create = async (req, res, next) => {
    try {
      const result = await app.services.cliente.save(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  };

  const get = (req, res, next) => {
    app.services.cliente.findOne({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const del = ('/:id', async (req, res, next) => {
    app.services.cliente.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  const update = ('/:id', (req, res, next) => {
    app.services.cliente.update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  });

  return {
    findAll, create, get, del, update,
  };
};
