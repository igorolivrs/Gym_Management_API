const jwt = require('jwt-simple');
const request = require('supertest');

const app = require('../../src/app');

const MAIN_ROUTE = '/reservas';
let cliente;
let aula;
const secret = 'smartgym123';

beforeAll(async () => {
  const res1 = await app.services.cliente.save({
    name: 'José Igor', email: `${Date.now()}@gmail.com`, nif: `NIF${Date.now()}`, password: 'pass123',
  });
  const res2 = await app.services.aula.save({
    nome_aula: 'Yoga', data: `${Date.now()}`, instrutor: 'Gustavo Casellas', local: 'Estudio 1', duracao: '45 min', nivel: 'Leve', descricao: 'Aula de hippster',
  });
  cliente = { ...res1[0] };
  aula = { ...res2[0] };
  cliente.token = jwt.encode(cliente, secret);
});

test('Test #24 - Inserir Reserva Aula', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${cliente.token}`)
    .send({ cliente_id: cliente.id, aula_id: aula.id })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.cliente_id).toBe(cliente.id);
    });
});

test('Teste #25 - Listar Reservas', () => {
  return app.db('reservas')
    .then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${cliente.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Teste #26 - Deletar Reserva por ID', () => {
  return app.db('reservas')
    .then((reser) => request(app).delete(`/reservas/${reser[2].id}`)
      .set('authorization', `bearer ${cliente.token}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
