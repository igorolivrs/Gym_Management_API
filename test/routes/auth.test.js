const request = require('supertest');
const app = require('../../src/app');

const MAIL = `${Date.now()}@gmail.com`;
const NIF = `NIF${Date.now()}`;

test('Test #27 - Receber Token ao autenticar', () => {
  return app.services.cliente.save(
    {
      name: 'Cliente Auth', email: MAIL, nif: NIF, password: 'pass123',
    },
  ).then(() => request(app).post('/auth/signin')
    .send({ nif: NIF, password: 'pass123' })).then((res) => {
    expect(res.status).toBe(200);
    console.log(res.body);
    expect(res.body).toHaveProperty('token');
  });
});

test('Test #28 - Tentativa de autenticação errada', () => {
  const nNIF = `NIF${Date.now()}`;
  const nMAIL = `${Date.now()}@gmail.com`;
  return app.services.cliente.save(
    {
      name: 'Cliente Auth2', email: nMAIL, nif: nNIF, password: 'pass123',
    },
  ).then(() => request(app).post('/auth/signin')
    .send({ nif: NIF, password: 'pass456' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Autenticação Inválida!');
    });
});

test('Test #29 - Tentativa de autenticação com utilizador errado', () => {
  const nNIF = `NIF${Date.now()}`;
  return request(app).post('/auth/signin').send({ nif: nNIF, password: 'pass456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Autenticação Inválida! #2');
    });
});

test('Test #30 - Aceder a rotas protegidas', () => {
  return request(app).get('/clientes')
    .then((res) => {
      expect(res.status).toBe(401);
    });
});

test('Test #31 - Criar Utilizador', () => {
  const nNIF = `NIF${Date.now()}`;
  const nMAIL = `${Date.now()}@gmail.com`;
  return request(app).post('/auth/signup')
    .send({
      name: 'Cliente Signup', email: nMAIL, nif: nNIF, password: 'pass123',
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Cliente Signup');
      expect(res.body).toHaveProperty('email');
      expect(res.body).toHaveProperty('nif');
      expect(res.body).not.toHaveProperty('password');
    });
});
