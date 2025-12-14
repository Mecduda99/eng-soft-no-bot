const express = require('express');
const router = express.Router();

// POST /identities - Criar Identidade Descentralizada (DID)
router.post('/', async (req, res) => {
  try {
    const { did } = req.body;
    const db = req.app.locals.db;
    
    await db.run(
      'INSERT INTO identities (did, creation_timestamp) VALUES (?, ?)',
      [did, Date.now()]
    );
    
    res.status(201).json({ message: 'DID criado com sucesso', did });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /identities/:did - Consultar Status de Identidade
router.get('/:did', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const identity = await db.get(
      'SELECT * FROM identities WHERE did = ?',
      [req.params.did]
    );
    
    if (!identity) {
      return res.status(404).json({ error: 'Identidade não encontrada' });
    }
    
    res.json(identity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /identities/:did/link - Vincular Conta Gov.br/CIN
router.put('/:did/link', async (req, res) => {
  try {
    const { gov_id_ref } = req.body;
    const db = req.app.locals.db;
    const eventBus = req.app.locals.eventBus;
    
    await db.run(
      'UPDATE identities SET gov_link_status = ?, gov_id_ref = ? WHERE did = ?',
      ['LINKED', gov_id_ref, req.params.did]
    );
    
    // Publicar evento assíncrono
    await eventBus.publish('IdentityLinked', {
      did: req.params.did,
      gov_id_ref,
      timestamp: Date.now()
    });
    
    res.json({ message: 'Identidade vinculada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /credentials/:did/issue - Emitir Credencial Verificável (VC)
router.post('/credentials/:did/issue', async (req, res) => {
  try {
    const { vc_id, expiration_date } = req.body;
    const db = req.app.locals.db;
    
    await db.run(
      'INSERT INTO credentials (vc_id, did_owner, issue_date, expiration_date) VALUES (?, ?, ?, ?)',
      [vc_id, req.params.did, Date.now(), expiration_date]
    );
    
    res.status(201).json({ message: 'Credencial emitida com sucesso', vc_id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;