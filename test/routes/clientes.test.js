const jwt = require('jwt-simple');
const request = require('supertest');

const app = require('../../src/app');

const MAIL = `${Date.now()}@gmail.com`;
const NIF = `NIF${Date.now()}`;
const secret = 'smartgym123';
let user;

beforeAll(async () => {
  const uMAIL = `${Date.now()}@gmail.com`;
  const uNIF = `NIF${Date.now()}`;
  const res = await app.services.cliente.save({
    name: 'José Igor', email: uMAIL, nif: uNIF, password: 'pass123',
  });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
});

test('Teste #1 - Listar Clientes', () => {
  return request(app).get('/clientes')
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Teste #2 - Inserir Clientes', () => {
  return request(app).post('/clientes')
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: 'José Igor', email: MAIL, nif: NIF, password: 'pass123',
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('José Igor');
      expect(res.body).not.toHaveProperty('password');
    });
});

test('Teste #2.1 - Salvar a password encriptada', async () => {
  const res = await request(app).post('/clientes')
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: 'Pass Encriptada', email: `${Date.now()}@gmail.com`, nif: `NIF${Date.now()}`, password: 'pass123',
    });
  expect(res.status).toBe(201);

  const { id } = res.body;
  const clienteDb = await app.services.cliente.findOne({ id });

  expect(clienteDb.password).not.toBeUndefined();
  expect(clienteDb.password).not.toBe('pass123');
});

test('Teste #3 - Inserir Clientes sem Name', () => request(app).post('/clientes')
  .set('authorization', `bearer ${user.token}`)
  .send({
    email: MAIL, nif: NIF, password: 'pass123',
  })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Name é um atributo obrigatório');
  }));

test('Teste #4 - Inserir Clientes sem Email', async () => {
  const result = await request(app).post('/clientes')
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: 'José Igor', nif: NIF, password: 'pass123',
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email é um atributo obrigatório');
});

test('Teste #5 - Inserir Clientes sem Password', () => {
  return request(app).post('/clientes')
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'José Igor', email: MAIL, nif: NIF })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Password é um atributo obrigatório');
    });
});

test('Teste #6 - Inserir Clientes sem NIF', () => {
  return request(app).post('/clientes')
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'José Igor', email: MAIL, password: 'pass123' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('NIF é um atributo obrigatório');
    });
});

test('Teste #7 - Inserir Clientes com Email Duplicado', () => {
  return request(app).post('/clientes')
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: 'José Igor', email: MAIL, nif: NIF, password: 'pass123',
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email duplicado na Base de Dados');
    });
});

test('Teste #8 - Inserir Clientes com NIF Duplicado', () => {
  return request(app).post('/clientes')
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: 'José Igor', email: `${Date.now()}@gmail.com`, nif: NIF, password: 'pass123',
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('NIF duplicado na Base de Dados');
    });
});

test('Teste #9 - Listar Clientes por ID', () => {
  return app.db('clientes')
    .then((cli) => request(app).get(`/clientes/${cli[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

test('Teste #10 - Alterar um Cliente', () => {
  return app.db('clientes')
    .then((cli) => request(app).put(`/clientes/${cli[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: 'Nome Atualizado' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Nome Atualizado');
    });
});

test('Teste #11 - Deletar Cliente por ID', () => {
  return app.db('clientes')
    .then((cli) => request(app).delete(`/clientes/${cli[2].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
