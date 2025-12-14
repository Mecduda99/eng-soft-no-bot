const express = require('express');
const router = express.Router();

// Simulação do adaptador blockchain
const blockchainAdapter = {
  async registerRevocation(vc_id) {
    // Simulação de registro na blockchain
    console.log(`Registrando revogação na blockchain para VC: ${vc_id}`);
    return Math.random() > 0.05; // 95% de sucesso para simulação
  }
};

// POST /revocations - Registrar Revogação de Credencial
router.post('/', async (req, res) => {
  try {
    const { vc_id, reason } = req.body;
    const db = req.app.locals.db;
    const eventBus = req.app.locals.eventBus;
    
    // Registrar revogação na blockchain
    const blockchainSuccess = await blockchainAdapter.registerRevocation(vc_id);
    
    if (blockchainSuccess) {
      // Salvar no banco local
      await db.run(
        'INSERT INTO revocations (vc_id, revocation_date, reason, blockchain_update_status) VALUES (?, ?, ?, ?)',
        [vc_id, Date.now(), reason, 'COMPLETED']
      );
      
      // Publicar evento assíncrono
      await eventBus.publish('CredentialRevoked', {
        vc_id,
        reason,
        timestamp: Date.now()
      });
      
      res.status(202).json({
        status: 'Accepted',
        message: `VC ${vc_id} revogada com sucesso`
      });
    } else {
      res.status(500).json({ error: 'Falha ao registrar na Blockchain' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /revocations/:vc_id - Consultar Status de Revogação
router.get('/:vc_id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const revocation = await db.get(
      'SELECT * FROM revocations WHERE vc_id = ?',
      [req.params.vc_id]
    );
    
    if (!revocation) {
      return res.status(404).json({ error: 'Revogação não encontrada' });
    }
    
    res.json(revocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /revocations/:vc_id - Remover Registro de Revogação
router.delete('/:vc_id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db.run(
      'DELETE FROM revocations WHERE vc_id = ?',
      [req.params.vc_id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Revogação não encontrada' });
    }
    
    res.json({ message: 'Registro de revogação removido' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;