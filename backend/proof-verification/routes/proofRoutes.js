const express = require('express');
const router = express.Router();

// Simulação do adaptador blockchain
const blockchainAdapter = {
  async validateProof(zkProof) {
    // Simulação de validação ZK-Proof na blockchain
    return Math.random() > 0.1; // 90% de sucesso para simulação
  }
};

// POST /proofs/verify - Receber e Validar ZK-Proof
router.post('/verify', async (req, res) => {
  try {
    const { zkProof } = req.body;
    const { did, vc_id } = zkProof;
    
    const db = req.app.locals.db;
    const revocationCache = req.app.locals.revocationCache;
    
    // Verificar se a credencial foi revogada
    if (revocationCache.has(vc_id)) {
      return res.status(403).json({
        status: 'Revoked',
        result: 'Access Denied - Credencial revogada'
      });
    }
    
    // Validar prova na blockchain
    const isValid = await blockchainAdapter.validateProof(zkProof);
    const result = isValid ? 'VERIFIED' : 'FAILED';
    
    // Registrar log da verificação
    const logResult = await db.run(
      'INSERT INTO verification_logs (did_submitted, proof_result, verification_timestamp, blockchain_tx_ref) VALUES (?, ?, ?, ?)',
      [did, result, Date.now(), `tx_${Date.now()}`]
    );
    
    res.json({
      status: result,
      result: isValid ? 'Provas de humanidade com privacidade verificadas' : 'Falha na verificação',
      log_id: logResult.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /proofs/:proof_id - Consultar Resultado da Validação
router.get('/:log_id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const log = await db.get(
      'SELECT * FROM verification_logs WHERE log_id = ?',
      [req.params.log_id]
    );
    
    if (!log) {
      return res.status(404).json({ error: 'Log de verificação não encontrado' });
    }
    
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;