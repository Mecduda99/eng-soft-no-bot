import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Identity Service API calls
export const identityService = {
  createIdentity: (did) => api.post('/identities', { did }),
  getIdentity: (did) => api.get(`/identities/${did}`),
  linkIdentity: (did, gov_id_ref) => api.put(`/identities/${did}/link`, { gov_id_ref }),
  issueCredential: (did, vc_id, expiration_date) => 
    api.post(`/credentials/${did}/issue`, { vc_id, expiration_date }),
};

// Proof Verification Service API calls
export const proofService = {
  verifyProof: (zkProof) => api.post('/proofs/verify', { zkProof }),
  getVerificationResult: (log_id) => api.get(`/proofs/${log_id}`),
};

// Credential Revocation Service API calls
export const revocationService = {
  revokeCredential: (vc_id, reason) => api.post('/revocations', { vc_id, reason }),
  getRevocationStatus: (vc_id) => api.get(`/revocations/${vc_id}`),
};

// Monitoring Service API calls
export const monitoringService = {
  getTrafficAnomalies: () => api.get('/monitoring/anomalies'),
};

export default api;