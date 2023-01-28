module.exports = (app) => {
  const findAll = (filter = {}) => app.db('niveis').where(filter).select(['id', 'nivel']);

  const update = async (id, nivel) => {
    return app.db('niveis')
      .where({ id })
      .update(nivel, '*');
  };

  return {
    findAll, update,
  };
};
