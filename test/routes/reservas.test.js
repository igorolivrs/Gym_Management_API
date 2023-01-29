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
    nome_aula: 'Yoga', data: `${Date.now()}`, horario: '09:30', instrutor: 'Gustavo Casellas', local: 'Estudio 1', duracao: '45 min', nivel: 'Leve', descricao: 'Aula de hippster',
  });
  const res3 = await app.services.cliente.save({
    name: 'João Santos', email: `${Date.now()}@gmail.com`, nif: `NIF${Date.now()}`, password: 'pass123',
  });
  const res4 = await app.services.aula.save({
    nome_aula: 'Pilates', data: `${Date.now()}`, horario: '09:30', instrutor: 'Abner Teixeira', local: 'Estudio 2', duracao: '40 min', nivel: 'Leve', descricao: 'Aula Livre',
  });

  cliente = { ...res1[0] };
  aula = { ...res2[0] };

  cliente2 = { ...res3[0] };
  aula2 = { ...res4[0] };
  cliente.token = jwt.encode(cliente, secret);
  cliente2.token = jwt.encode(cliente2, secret);
});

test('Test #32 - Inserir Reserva Aula', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${cliente.token}`)
    .send({
      cliente_id: cliente.id, aula_id: aula.id, aula_nome: 'nome aula', aula_data: 'aula data', aula_horario: 'aula horario', aula_instrutor: 'Nome Instrutor', aula_local: 'Local Aula', aula_duracao: 'Duração da Aula', aula_nivel: 'aula nivel', aula_descricao: 'Descrição sobre a aula', aula_image: 'Card Image da Aula',
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.cliente_id).toBe(cliente.id);
    });
});

test('Teste #33 - Listar Reservas', () => {
  return app.db('reservas')
    .then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${cliente.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Teste #44 - Listar Reservas por ID', () => {
  return app.db('reservas')
    .then((reser) => request(app).get(`${MAIN_ROUTE}/${reser[0].id}`)
      .set('authorization', `bearer ${cliente.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

test('Teste #34 - Deletar Reserva por ID', () => {
  return app.db('reservas')
    .then((reser) => request(app).delete(`${MAIN_ROUTE}/${reser[0].id}`)
      .set('authorization', `bearer ${cliente.token}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Teste #35 - Listar apenas reservas do utilizador', () => {
  return app.db('reservas')
    .insert([
      {
        cliente_id: cliente.id, aula_id: aula.id, aula_nome: 'nome aula', aula_data: 'aula data', aula_horario: 'aula horario', aula_instrutor: 'Nome Instrutor', aula_local: 'Local Aula', aula_duracao: 'Duração da Aula', aula_nivel: 'aula nivel', aula_descricao: 'Descrição sobre a aula', aula_image: 'Card Image da Aula',
      },
      {
        cliente_id: cliente2.id, aula_id: aula2.id, aula_nome: 'nome aula 2', aula_data: 'aula data 2', aula_horario: 'aula horario 2', aula_instrutor: 'Nome Instrutor 2', aula_local: 'Local Aula 2', aula_duracao: 'Duração da Aula 2', aula_nivel: 'aula nivel 2', aula_descricao: 'Descrição sobre a aula 2', aula_image: 'Card Image da Aula 2',
      },
    ]).then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${cliente2.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].cliente_id).toBe(cliente2.id);
    });
});

test('Teste #36 - Inserir Reserva com Aula Duplicada', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${cliente.token}`)
    .send({
      cliente_id: cliente.id, aula_id: aula.id, aula_nome: 'nome aula', aula_data: 'aula data', aula_horario: 'aula horario', aula_instrutor: 'Nome Instrutor', aula_local: 'Local Aula', aula_duracao: 'Duração da Aula', aula_nivel: 'aula nivel', aula_descricao: 'Descrição sobre a aula', aula_image: 'Card Image da Aula',
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Aula já reservada');
    });
});

test('Teste #51 - Inserir Reserva sem Cliente ID', () => request(app).post(MAIN_ROUTE)
  .set('authorization', `bearer ${cliente.token}`)
  .send({
    aula_id: aula.id, aula_nome: 'nome aula', aula_data: 'aula data', aula_horario: 'aula horario', aula_instrutor: 'Nome Instrutor', aula_local: 'Local Aula', aula_duracao: 'Duração da Aula', aula_nivel: 'aula nivel', aula_descricao: 'Descrição sobre a aula', aula_image: 'Card Image da Aula',
  })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Cliente ID é um atributo obrigatório');
  }));

test('Teste #51 - Inserir Reserva sem Aula ID', () => request(app).post(MAIN_ROUTE)
  .set('authorization', `bearer ${cliente.token}`)
  .send({
    cliente_id: cliente.id, aula_nome: 'nome aula', aula_data: 'aula data', aula_horario: 'aula horario', aula_instrutor: 'Nome Instrutor', aula_local: 'Local Aula', aula_duracao: 'Duração da Aula', aula_nivel: 'aula nivel', aula_descricao: 'Descrição sobre a aula', aula_image: 'Card Image da Aula',
  })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Aula ID é um atributo obrigatório');
  }));
