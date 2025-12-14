const request = require('supertest');
const express = require('express');
const identityRoutes = require('../routes/identityRoutes');

const app = express();
app.use(express.json());
app.use('/identities', identityRoutes);

// Mock database and event bus
app.locals.db = {
  run: jest.fn(),
  get: jest.fn(),
  all: jest.fn()
};
app.locals.eventBus = {
  publish: jest.fn()
};

describe('Identity Service', () => {
  test('should create new DID', async () => {
    app.locals.db.run.mockResolvedValue({ id: 1 });
    
    const response = await request(app)
      .post('/identities')
      .send({ did: 'did:example:123' });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('DID criado com sucesso');
  });

  test('should link identity to Gov.br', async () => {
    app.locals.db.run.mockResolvedValue({ changes: 1 });
    app.locals.eventBus.publish.mockResolvedValue();
    
    const response = await request(app)
      .put('/identities/did:example:123/link')
      .send({ gov_id_ref: 'gov123' });
    
    expect(response.status).toBe(200);
    expect(app.locals.eventBus.publish).toHaveBeenCalledWith('IdentityLinked', expect.any(Object));
  });
});