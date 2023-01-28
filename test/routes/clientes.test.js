const jwt = require('jwt-simple');
const request = require('supertest');

const app = require('../../src/app');

const MAIL = `${Date.now()}@gmail.com`;
const NIF = `NIF${Date.now()}`;
const secret = 'smartgym123';
const MAIN_ROUTE = '/v1/clientes';
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
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Teste #2 - Inserir Clientes', () => {
  return request(app).post(MAIN_ROUTE)
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

test('Teste #3 - Salvar a password encriptada', async () => {
  const res = await request(app).post(MAIN_ROUTE)
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

test('Teste #4 - Inserir Clientes sem Name', () => request(app).post(MAIN_ROUTE)
  .set('authorization', `bearer ${user.token}`)
  .send({
    email: MAIL, nif: NIF, password: 'pass123',
  })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Name é um atributo obrigatório');
  }));

test('Teste #5 - Inserir Clientes sem Email', async () => {
  const result = await request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: 'José Igor', nif: NIF, password: 'pass123',
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email é um atributo obrigatório');
});

test('Teste #6 - Inserir Clientes sem Password', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'José Igor', email: MAIL, nif: NIF })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Password é um atributo obrigatório');
    });
});

test('Teste #7 - Inserir Clientes sem NIF', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'José Igor', email: MAIL, password: 'pass123' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('NIF é um atributo obrigatório');
    });
});

test('Teste #8 - Inserir Clientes com Email Duplicado', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: 'José Igor', email: MAIL, nif: NIF, password: 'pass123',
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email duplicado na Base de Dados');
    });
});

test('Teste #9 - Inserir Clientes com NIF Duplicado', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: 'José Igor', email: `${Date.now()}@gmail.com`, nif: NIF, password: 'pass123',
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('NIF duplicado na Base de Dados');
    });
});

test('Teste #10 - Listar Clientes por ID', () => {
  return app.db('clientes')
    .then((cli) => request(app).get(`${MAIN_ROUTE}/${cli[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

test('Teste #11 - Alterar um Cliente', () => {
  return app.db('clientes')
    .then((cli) => request(app).put(`${MAIN_ROUTE}/${cli[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({
        name: 'Nome Atualizado', email: `${Date.now()}@gmail.com`, nif: `NIF${Date.now()}`, password: 'pass123',
      }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Nome Atualizado');
    });
});

test('Teste #12 - Alterar um Cliente sem Nome', () => {
  return app.db('clientes')
    .then((cli) => request(app).put(`${MAIN_ROUTE}/${cli[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({
        email: `${Date.now()}@gmail.com`, nif: `NIF${Date.now()}`, password: 'pass123',
      }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
    });
});

test('Teste #13 - Alterar um Cliente sem Email', () => {
  return app.db('clientes')
    .then((cli) => request(app).put(`${MAIN_ROUTE}/${cli[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({
        name: 'Cliente sem email', nif: `NIF${Date.now()}`, password: 'pass123',
      }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email é um atributo obrigatório');
    });
});

test('Teste #14 - Alterar um Cliente sem NIF', () => {
  return app.db('clientes')
    .then((cli) => request(app).put(`${MAIN_ROUTE}/${cli[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({
        name: 'Cliente sem email', email: `${Date.now()}@gmail.com`, password: 'pass123',
      }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('NIF é um atributo obrigatório');
    });
});

test('Teste #15 - Alterar um Cliente sem Password', () => {
  return app.db('clientes')
    .then((cli) => request(app).put(`${MAIN_ROUTE}/${cli[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({
        name: 'Cliente sem email', email: `${Date.now()}@gmail.com`, nif: `NIF${Date.now()}`,
      }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Password é um atributo obrigatório');
    });
});

test('Teste #16 - Deletar Cliente por ID', () => {
  return app.db('clientes')
    .insert({
      name: 'Cliente Deletado', email: `${Date.now()}@gmail.com`, nif: `NIF${Date.now()}`, password: 'pass123',
    }, ['id'])
    .then((cli) => request(app).delete(`${MAIN_ROUTE}/${cli[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
