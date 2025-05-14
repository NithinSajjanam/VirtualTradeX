const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const app = require('../server'); // Assuming server.js exports the app

describe('API Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database or mock
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET /api/portfolio - should return portfolio data', async () => {
    const res = await request(app).get('/api/portfolio');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/news - should return news data', async () => {
    const res = await request(app).get('/api/news');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/market - should return market data', async () => {
    const res = await request(app).get('/api/market');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/trade - should create a new trade', async () => {
    const tradeData = {
      stockSymbol: 'AAPL',
      quantity: 10,
      price: 150,
      tradeType: 'buy',
    };
    const res = await request(app)
      .post('/api/trade')
      .send(tradeData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  test('POST /api/ai - should respond to AI request', async () => {
    const aiRequest = {
      prompt: 'Hello AI',
    };
    const res = await request(app)
      .post('/api/ai')
      .send(aiRequest);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('response');
  });
});
