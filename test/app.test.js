const request = require('supertest');

const app = require('../src/app');

test('Testar a aplicação', () => request(app).get('/').then((res) => {
  expect(res.status).toBe(200);
}));
