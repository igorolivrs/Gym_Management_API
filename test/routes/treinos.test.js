const jwt = require('jwt-simple');
const request = require('supertest');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/treinos';
const secret = 'smartgym123';
let cliente;
let cliente2;

beforeAll(async () => {
  const res1 = await app.services.cliente.save({
    name: 'José Igor', email: `${Date.now()}@gmail.com`, nif: `NIF${Date.now()}`, password: 'pass123',
  });

  const res2 = await app.services.cliente.save({
    name: 'José Igor', email: `${Date.now()}@gmail.com`, nif: `NIF${Date.now()}`, password: 'pass123',
  });

  cliente = { ...res1[0] };
  cliente2 = { ...res2[0] };
  cliente.token = jwt.encode(cliente, secret);
  cliente2.token = jwt.encode(cliente2, secret);
});

test('Test #42 - Inserir Treinos', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${cliente.token}`)
    .send({
      cliente_id: cliente.id, musculo: 'peitoral', exercicio: 'supino', series: '3', repeticoes: '8 - 12', descanso: '45s',
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.cliente_id).toBe(cliente.id);
    });
});

test('Teste #43 - Listar Treinos', () => {
  return app.db('treinos')
    .then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${cliente.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Teste #44 - Listar Treinos por ID', () => {
  return app.db('treinos')
    .then((treino) => request(app).get(`${MAIN_ROUTE}/${treino[0].id}`)
      .set('authorization', `bearer ${cliente.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

test('Teste #45 - Alterar um Treino', () => {
  return app.db('treinos')
    .then((treino) => request(app).put(`${MAIN_ROUTE}/${treino[0].id}`)
      .set('authorization', `bearer ${cliente.token}`)
      .send({
        cliente_id: cliente.id, musculo: 'Treino Alterado', exercicio: 'remada alta', series: '5', repeticoes: '8 - 12', descanso: '45s',
      }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.musculo).toBe('Treino Alterado');
    });
});

test('Teste #46 - Deletar Treino por ID', () => {
  return app.db('treinos')
    .then((treino) => request(app).delete(`${MAIN_ROUTE}/${treino[0].id}`)
      .set('authorization', `bearer ${cliente.token}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Teste #47 - Inserir Treino sem Cliente ID', () => request(app).post(MAIN_ROUTE)
  .set('authorization', `bearer ${cliente.token}`)
  .send({
    musculo: 'peitoral', exercicio: 'supino', series: '3', repeticoes: '8 - 12', descanso: '45s',
  })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Cliente ID é um atributo obrigatório');
  }));

test('Teste #48 - Inserir Treino sem Músculo', () => request(app).post(MAIN_ROUTE)
  .set('authorization', `bearer ${cliente.token}`)
  .send({
    cliente_id: cliente.id, exercicio: 'supino', series: '3', repeticoes: '8 - 12', descanso: '45s',
  })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Músculo é um atributo obrigatório');
  }));

test('Teste #49 - Inserir Treino sem Exercício', () => request(app).post(MAIN_ROUTE)
  .set('authorization', `bearer ${cliente.token}`)
  .send({
    cliente_id: cliente.id, musculo: 'peitoral', series: '3', repeticoes: '8 - 12', descanso: '45s',
  })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Exercício é um atributo obrigatório');
  }));

test('Teste #50 - Inserir Treino sem Séries', () => request(app).post(MAIN_ROUTE)
  .set('authorization', `bearer ${cliente.token}`)
  .send({
    cliente_id: cliente.id, musculo: 'peitoral', exercicio: 'supino', repeticoes: '8 - 12', descanso: '45s',
  })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Séries é um atributo obrigatório');
  }));

test('Teste #50 - Inserir Treino sem Repetições', () => request(app).post(MAIN_ROUTE)
  .set('authorization', `bearer ${cliente.token}`)
  .send({
    cliente_id: cliente.id, musculo: 'peitoral', exercicio: 'supino', series: '3', descanso: '45s',
  })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Repetições é um atributo obrigatório');
  }));

test('Teste #51 - Inserir Treino sem Descanso', () => request(app).post(MAIN_ROUTE)
  .set('authorization', `bearer ${cliente.token}`)
  .send({
    cliente_id: cliente.id, musculo: 'peitoral', exercicio: 'supino', series: '3', repeticoes: '8 - 12',
  })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Descanso é um atributo obrigatório');
  }));
