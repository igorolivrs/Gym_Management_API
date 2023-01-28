const jwt = require('jwt-simple');
const request = require('supertest');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/niveis';
let cliente;
const secret = 'smartgym123';

beforeAll(async () => {
  const res1 = await app.services.cliente.save({
    name: 'José Igor', email: `${Date.now()}@gmail.com`, nif: `NIF${Date.now()}`, password: 'pass123',
  });
  cliente = { ...res1[0] };
  cliente.token = jwt.encode(cliente, secret);
  return app.db.seed.run();
});

test('Teste #17 - Listar Niveis', () => request(app).get(MAIN_ROUTE)
  .set('authorization', `bearer ${cliente.token}`)
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  }));

test('Teste #18 - Alterar um Nível', () => {
  return app.db('niveis')
    .then((nivel) => request(app).put(`${MAIN_ROUTE}/${nivel[0].id}`)
      .set('authorization', `bearer ${cliente.token}`)
      .send({ nivel: 'Nível Alterado' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.nivel).toBe('Nível Alterado');
    });
});
