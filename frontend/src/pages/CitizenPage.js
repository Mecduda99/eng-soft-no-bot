import React, { useState } from 'react';
import { identityService, proofService, revocationService } from '../services/api';

function CitizenPage() {
  const [did, setDid] = useState('');
  const [govId, setGovId] = useState('');
  const [vcId, setVcId] = useState('');
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateIdentity = async () => {
    if (!did) return;
    setLoading(true);
    try {
      await identityService.createIdentity(did);
      setMessage('Identidade criada com sucesso!');
      await handleGetIdentity();
    } catch (error) {
      setMessage('Erro ao criar identidade: ' + error.response?.data?.error);
    }
    setLoading(false);
  };

  const handleLinkIdentity = async () => {
    if (!did || !govId) return;
    setLoading(true);
    try {
      await identityService.linkIdentity(did, govId);
      setMessage('Identidade vinculada ao Gov.br com sucesso!');
      await handleGetIdentity();
    } catch (error) {
      setMessage('Erro ao vincular identidade: ' + error.response?.data?.error);
    }
    setLoading(false);
  };

  const handleGetIdentity = async () => {
    if (!did) return;
    setLoading(true);
    try {
      const response = await identityService.getIdentity(did);
      setIdentity(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Identidade não encontrada');
      setIdentity(null);
    }
    setLoading(false);
  };

  const handleIssueCredential = async () => {
    if (!did || !vcId) return;
    setLoading(true);
    try {
      const expirationDate = Date.now() + (365 * 24 * 60 * 60 * 1000); // 1 year
      await identityService.issueCredential(did, vcId, expirationDate);
      setMessage('Credencial emitida com sucesso!');
    } catch (error) {
      setMessage('Erro ao emitir credencial: ' + error.response?.data?.error);
    }
    setLoading(false);
  };

  const handleRevokeCredential = async () => {
    if (!vcId) return;
    setLoading(true);
    try {
      await revocationService.revokeCredential(vcId, 'COMPROMISED');
      setMessage('Credencial revogada com sucesso!');
    } catch (error) {
      setMessage('Erro ao revogar credencial: ' + error.response?.data?.error);
    }
    setLoading(false);
  };

  const handleVerifyHumanity = async () => {
    if (!did || !vcId) return;
    setLoading(true);
    try {
      const zkProof = {
        did: did,
        vc_id: vcId,
        proof: 'zk_proof_data_' + Date.now()
      };
      const response = await proofService.verifyProof(zkProof);
      setMessage(`Verificação: ${response.data.status} - ${response.data.result}`);
    } catch (error) {
      setMessage('Erro na verificação: ' + error.response?.data?.error);
    }
    setLoading(false);
  };

  return (
    <div className="citizen-page">
      <h2 style={{ color: '#00FF00' }}>Painel do Cidadão</h2>
      <p>Gerencie sua identidade digital e credenciais verificáveis</p>

      <div className="card">
        <h3>Criar/Consultar Identidade Digital</h3>
        <input
          type="text"
          className="input"
          placeholder="DID (ex: did:example:123)"
          value={did}
          onChange={(e) => setDid(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button className="btn" onClick={handleCreateIdentity} disabled={loading}>
            Criar DID
          </button>
          <button className="btn" onClick={handleGetIdentity} disabled={loading}>
            Consultar DID
          </button>
        </div>
      </div>

      {identity && (
        <div className="card">
          <h3>Informações da Identidade</h3>
          <p><strong>DID:</strong> {identity.did}</p>
          <p><strong>Status:</strong> 
            <span className={`status-${identity.gov_link_status.toLowerCase()}`}>
              {identity.gov_link_status}
            </span>
          </p>
          <p><strong>Referência Gov.br:</strong> {identity.gov_id_ref || 'Não vinculado'}</p>
          <p><strong>Criado em:</strong> {new Date(identity.creation_timestamp).toLocaleString()}</p>
        </div>
      )}

      <div className="card">
        <h3>Vincular ao Gov.br/CIN</h3>
        <input
          type="text"
          className="input"
          placeholder="ID Gov.br/CIN"
          value={govId}
          onChange={(e) => setGovId(e.target.value)}
        />
        <button className="btn" onClick={handleLinkIdentity} disabled={loading}>
          Vincular Identidade
        </button>
      </div>

      <div className="card">
        <h3>Gerenciar Credenciais</h3>
        <input
          type="text"
          className="input"
          placeholder="ID da Credencial (VC)"
          value={vcId}
          onChange={(e) => setVcId(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button className="btn" onClick={handleIssueCredential} disabled={loading}>
            Emitir Credencial
          </button>
          <button className="btn" onClick={handleRevokeCredential} disabled={loading}>
            Revogar Credencial
          </button>
        </div>
      </div>

      <div className="verification-box">
        <h3>Prova de Humanidade</h3>
        <p>Status: Aguardando Prova de Humanidade...</p>
        <button 
          className="btn" 
          onClick={handleVerifyHumanity} 
          disabled={loading}
          style={{ backgroundColor: '#00FF00', color: '#000000' }}
        >
          Enviar Prova Segura (ZK-Proof)
        </button>
      </div>

      {message && (
        <div className="card">
          <p style={{ color: message.includes('sucesso') ? '#00FF00' : '#FF0000' }}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
}

export default CitizenPage;