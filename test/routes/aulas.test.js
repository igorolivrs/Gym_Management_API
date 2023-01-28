const jwt = require('jwt-simple');
const request = require('supertest');

const app = require('../../src/app');

const DATA = `${Date.now()}`;

// eslint-disable-next-line no-unused-vars
const MAIN_ROUTE = '/v1/aulas';
let aula;
let cliente;
const secret = 'smartgym123';

beforeAll(async () => {
  const res1 = await app.services.aula.save({
    nome_aula: 'Yoga', data: `${Date.now()}`, horario: '09:30', instrutor: 'Gustavo Casellas', local: 'Estudio 1', duracao: '45 min', nivel: 'Leve', descricao: 'Aula de hippster',
  });

  const res2 = await app.services.cliente.save({
    name: 'José Igor', email: `${Date.now()}@gmail.com`, nif: `NIF${Date.now()}`, password: 'pass123',
  });
  aula = { ...res1[0] };
  cliente = { ...res2[0] };
  cliente.token = jwt.encode(cliente, secret);
});

test('Teste #19 - Listar Aulas', () => request(app).get(MAIN_ROUTE)
  .set('authorization', `bearer ${cliente.token}`)
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  }));

test('Teste #20 - Inserir Aula', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${cliente.token}`)
    .send({
      nome_aula: 'Yoga', data: DATA, horario: '09:30', instrutor: 'Gustavo Casellas', local: 'Estudio 1', duracao: '45 min', nivel: 'Leve', descricao: 'Aula de hippster',
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.nome_aula).toBe('Yoga');
    });
});

test('Teste #21 - Inserir Aula sem Nome', () => request(app).post(MAIN_ROUTE)
  .set('authorization', `bearer ${cliente.token}`)
  .send({
    data: '01/01/2022', horario: '10:30', instrutor: 'Gustavo Casellas', local: 'Estudio 1', duracao: '45 min', nivel: 'Leve', descricao: 'Aula de hippster',
  })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Nome é um atributo obrigatório');
  }));

test('Teste #22 - Inserir Aula sem data', async () => {
  const result = await request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${cliente.token}`)
    .send({
      nome_aula: 'Yoga', horario: '11:30', instrutor: 'Gustavo Casellas', local: 'Estudio 1', duracao: '45 min', nivel: 'Leve', descricao: 'Aula de hippster',
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Data é um atributo obrigatório');
});

test('Teste #23 - Inserir Aula sem horário', async () => {
  const result = await request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${cliente.token}`)
    .send({
      nome_aula: 'Yoga', data: '01/01/2022', instrutor: 'Gustavo Casellas', local: 'Estudio 1', duracao: '45 min', nivel: 'Leve', descricao: 'Aula de hippster',
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Horário é um atributo obrigatório');
});

test('Teste #24 - Inserir Aula sem Instrutor', () => {
  request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${cliente.token}`)
    .send({
      nome_aula: 'Yoga', data: '01/01/2022', horario: '09:30', local: 'Estudio 1', duracao: '45 min', nivel: 'Leve', descricao: 'Aula de hippster',
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome do instrutor é um atributo obrigatório');
    });
});

test('Teste #25 - Inserir Aula sem Local', () => {
  request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${cliente.token}`)
    .send({
      nome_aula: 'Yoga', data: '01/01/2022', horario: '12:30', instrutor: 'Gustavo Casellas', duracao: '45 min', nivel: 'Leve', descricao: 'Aula de hippster',
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Local é um atributo obrigatório');
    });
});

test('Teste #26 - Inserir Aula sem Duração', () => {
  request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${cliente.token}`)
    .send({
      nome_aula: 'Yoga', data: '01/01/2022', horario: '09:30', instrutor: 'Gustavo Casellas', local: 'Estudio 1', nivel: 'Leve', descricao: 'Aula de hippster',
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Duração é um atributo obrigatório');
    });
});

test('Teste #27 - Inserir Aula sem Nivel', () => {
  request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${cliente.token}`)
    .send({
      nome_aula: 'Yoga', data: '01/01/2022', instrutor: 'Gustavo Casellas', local: 'Estudio 1', duracao: '45 min', descricao: 'Aula de hippster',
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nivel é um atributo obrigatório');
    });
});

test('Teste #28 - Listar Aulas por ID', () => {
  return app.db('aulas')
    .then((aul) => request(app).get(`${MAIN_ROUTE}/${aul[0].id}`)
      .set('authorization', `bearer ${cliente.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

test('Teste #29 - Alterar uma Aula', () => {
  return app.db('aulas')
    .then((aul) => request(app).put(`${MAIN_ROUTE}/${aul[0].id}`)
      .set('authorization', `bearer ${cliente.token}`)
      .send({
        nome_aula: 'Aula Alterada', data: '01/01/2022', instrutor: 'Gustavo Casellas', horario: '09:30', local: 'Estudio 1', duracao: '45 min', nivel: 'Leve', descricao: 'Aula de hippster',
      }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.nome_aula).toBe('Aula Alterada');
    });
});

test('Teste #30 - Alterar uma Aula sem Instrutor', () => {
  return app.db('aulas')
    .then((aul) => request(app).put(`${MAIN_ROUTE}/${aul[0].id}`)
      .set('authorization', `bearer ${cliente.token}`)
      .send({
        nome_aula: 'Yoga', data: '01/01/2022', horario: '09:30', local: 'Estudio 1', duracao: '45 min', nivel: 'Leve', descricao: 'Aula de hippster',
      }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome do instrutor é um atributo obrigatório');
    });
});

test('Teste #31 - Deletar Aulas por ID', () => {
  return app.db('aulas')
    .insert({
      nome_aula: 'Aula Deletada por ID', data: `${Date.now()}`, horario: '09:30', instrutor: 'João Ferreira', local: 'Estudio 3', duracao: '30 min', nivel: 'Leve', descricao: 'Aula...',
    }, ['id'])
    .then((aul) => request(app).delete(`${MAIN_ROUTE}/${aul[0].id}`)
      .set('authorization', `bearer ${cliente.token}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
