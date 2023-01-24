const jwt = require('jwt-simple');
const request = require('supertest');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/reservas';
let cliente;
let aula;
let cliente2;
let aula2;
const secret = 'smartgym123';

beforeAll(async () => {
  const res1 = await app.services.cliente.save({
    name: 'José Igor', email: `${Date.now()}@gmail.com`, nif: `NIF${Date.now()}`, password: 'pass123',
  });
  const res2 = await app.services.aula.save({
    nome_aula: 'Yoga', data: `${Date.now()}`, instrutor: 'Gustavo Casellas', local: 'Estudio 1', duracao: '45 min', nivel: 'Leve', descricao: 'Aula de hippster',
  });
  const res3 = await app.services.cliente.save({
    name: 'João Santos', email: `${Date.now()}@gmail.com`, nif: `NIF${Date.now()}`, password: 'pass123',
  });
  const res4 = await app.services.aula.save({
    nome_aula: 'Pilates', data: `${Date.now()}`, instrutor: 'Abner Teixeira', local: 'Estudio 2', duracao: '40 min', nivel: 'Leve', descricao: 'Aula Livre',
  });

  cliente = { ...res1[0] };
  aula = { ...res2[0] };

  cliente2 = { ...res3[0] };
  aula2 = { ...res4[0] };
  cliente.token = jwt.encode(cliente, secret);
  cliente2.token = jwt.encode(cliente2, secret);
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
    .then((reser) => request(app).delete(`${MAIN_ROUTE}/${reser[0].id}`)
      .set('authorization', `bearer ${cliente.token}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Teste #27 - Listar apenas reservas do utilizador', () => {
  return app.db('reservas')
    .insert([
      { cliente_id: cliente.id, aula_id: aula.id },
      { cliente_id: cliente2.id, aula_id: aula2.id },
    ]).then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${cliente2.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].cliente_id).toBe(cliente2.id);
    });
});
