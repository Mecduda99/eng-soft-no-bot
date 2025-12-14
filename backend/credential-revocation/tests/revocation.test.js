const request = require('supertest');
const express = require('express');
const revocationRoutes = require('../routes/revocationRoutes');

const app = express();
app.use(express.json());
app.use('/revocations', revocationRoutes);

// Mock dependencies
app.locals.db = {
  run: jest.fn(),
  get: jest.fn()
};
app.locals.eventBus = {
  publish: jest.fn()
};

describe('Credential Revocation Service', () => {
  test('should register credential revocation', async () => {
    app.locals.db.run.mockResolvedValue({ id: 1 });
    app.locals.eventBus.publish.mockResolvedValue();
    
    const response = await request(app)
      .post('/revocations')
      .send({ 
        vc_id: 'vc:compromised:123',
        reason: 'COMPROMISED'
      });
    
    expect(response.status).toBe(202);
    expect(response.body.status).toBe('Accepted');
    expect(app.locals.eventBus.publish).toHaveBeenCalledWith('CredentialRevoked', expect.any(Object));
  });

  test('should get revocation status', async () => {
    const mockRevocation = {
      vc_id: 'vc:123',
      revocation_date: Date.now(),
      reason: 'EXPIRED',
      blockchain_update_status: 'COMPLETED'
    };
    
    app.locals.db.get.mockResolvedValue(mockRevocation);
    
    const response = await request(app)
      .get('/revocations/vc:123');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRevocation);
  });
});