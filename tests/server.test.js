const request = require('supertest');
const { app, menu } = require('../server');

describe('API endpoints', () => {
  test('GET /menu returns menu array', async () => {
    const response = await request(app).get('/menu');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(menu);
  });

  test('POST /orders accepts an order', async () => {
    const order = [{ id: 1, name: '🍕 Pizza', price: 50000, category: 'cena', quantity: 1 }];
    const response = await request(app).post('/orders').send(order);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Pedido recibido con éxito');
    expect(response.body).toHaveProperty('order');
  });
});
