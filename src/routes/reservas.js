module.exports = (app) => {
  const findAll = (req, res, next) => {
    app.services.reserva.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const create = async (req, res, next) => {
    try {
      const result = await app.services.reserva.save(req);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  };

  const del = ('/:id', async (req, res, next) => {
    app.services.reserva.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  return { findAll, create, del };
};
