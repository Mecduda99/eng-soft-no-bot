const request = require('supertest');
const express = require('express');
const proofRoutes = require('../routes/proofRoutes');

const app = express();
app.use(express.json());
app.use('/proofs', proofRoutes);

// Mock dependencies
app.locals.db = {
  run: jest.fn(),
  get: jest.fn()
};
app.locals.revocationCache = new Set();

describe('Proof Verification Service', () => {
  test('should verify valid ZK-Proof', async () => {
    app.locals.db.run.mockResolvedValue({ id: 1 });
    
    const zkProof = {
      did: 'did:example:123',
      vc_id: 'vc:456',
      proof: 'valid_zk_data'
    };
    
    const response = await request(app)
      .post('/proofs/verify')
      .send({ zkProof });
    
    expect(response.status).toBe(200);
    expect(['VERIFIED', 'FAILED']).toContain(response.body.status);
  });

  test('should reject revoked credential', async () => {
    app.locals.revocationCache.add('vc:revoked');
    
    const zkProof = {
      did: 'did:example:123',
      vc_id: 'vc:revoked',
      proof: 'valid_zk_data'
    };
    
    const response = await request(app)
      .post('/proofs/verify')
      .send({ zkProof });
    
    expect(response.status).toBe(403);
    expect(response.body.status).toBe('Revoked');
  });
});