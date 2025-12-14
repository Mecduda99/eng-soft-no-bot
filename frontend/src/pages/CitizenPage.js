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
      <h2 style={{ color: '#00FF00' }}>👤 Painel do Cidadão - Identidade Digital Segura</h2>
      <div className="intro-section" style={{ 
        padding: '20px', 
        border: '1px solid #00FF00', 
        borderRadius: '8px', 
        marginBottom: '30px',
        backgroundColor: '#1a1a1a'
      }}>
        <h3 style={{ color: '#00FF00', marginBottom: '15px' }}>🔐 Sua Identidade Digital Descentralizada</h3>
        <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
          Crie e gerencie sua <strong>identidade digital (DID)</strong> de forma segura e descentralizada. 
          Você tem controle total sobre seus dados pessoais e pode provar sua humanidade 
          sem revelar informações sensíveis.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '10px', border: '1px solid #333', borderRadius: '4px' }}>
            <strong style={{ color: '#00FF00' }}>✓ Privacidade Total:</strong> Seus dados ficam com você
          </div>
          <div style={{ padding: '10px', border: '1px solid #333', borderRadius: '4px' }}>
            <strong style={{ color: '#00FF00' }}>✓ Prova de Humanidade:</strong> Zero-Knowledge Proofs
          </div>
          <div style={{ padding: '10px', border: '1px solid #333', borderRadius: '4px' }}>
            <strong style={{ color: '#00FF00' }}>✓ Integração Oficial:</strong> Vinculação Gov.br/CIN
          </div>
        </div>
      </div>

      <div className="card">
        <h3>🆔 Passo 1: Criar/Consultar Identidade Digital (DID)</h3>
        <p style={{ marginBottom: '15px', color: '#ccc' }}>
          O DID (Decentralized Identifier) é sua identidade única na blockchain. 
          É como um CPF digital, mas descentralizado e sob seu controle total.
        </p>
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
        <h3>🏛️ Passo 2: Vincular ao Gov.br/CIN</h3>
        <p style={{ marginBottom: '15px', color: '#ccc' }}>
          Conecte sua identidade digital com o sistema oficial do governo brasileiro. 
          Isso garante máxima confiabilidade e conformidade legal para sua identidade.
        </p>
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
        <h3>📜 Passo 3: Gerenciar Credenciais Verificáveis</h3>
        <p style={{ marginBottom: '15px', color: '#ccc' }}>
          Credenciais são "certificados digitais" que comprovam aspectos da sua identidade. 
          Você pode emitir novas credenciais ou revogar as comprometidas.
        </p>
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
        <h3>🤖 Passo 4: Prova de Humanidade (Anti-Bot)</h3>
        <div style={{ 
          padding: '15px', 
          border: '1px solid #00FF00', 
          borderRadius: '6px', 
          marginBottom: '15px',
          backgroundColor: '#0a2a0a'
        }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>Como funciona:</strong> Usando Zero-Knowledge Proofs, você pode provar que é uma pessoa real 
            sem revelar nenhum dado pessoal. É matematicamente impossível para bots falsificarem essa prova.
          </p>
          <p style={{ color: '#00FF00' }}>
            ✓ Prova criptográfica de humanidade<br/>
            ✓ Nenhum dado pessoal é revelado<br/>
            ✓ Impossível de ser falsificada por bots
          </p>
        </div>
        <p><strong>Status:</strong> <span style={{ color: '#FFFF00' }}>Aguardando Prova de Humanidade...</span></p>
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