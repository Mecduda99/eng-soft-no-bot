import React, { useState, useEffect } from 'react';
import { proofService, monitoringService } from '../services/api';

function CompanyPage() {
  const [userDid, setUserDid] = useState('');
  const [userVcId, setUserVcId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTrafficAnomalies();
  }, []);

  const loadTrafficAnomalies = async () => {
    try {
      const response = await monitoringService.getTrafficAnomalies();
      setAnomalies(response.data);
    } catch (error) {
      console.error('Erro ao carregar anomalias:', error);
    }
  };

  const handleVerifyUser = async () => {
    if (!userDid || !userVcId) {
      setMessage('Por favor, preencha DID e VC ID do usuário');
      return;
    }

    setLoading(true);
    try {
      const zkProof = {
        did: userDid,
        vc_id: userVcId,
        proof: 'company_verification_' + Date.now()
      };

      const response = await proofService.verifyProof(zkProof);
      setVerificationResult(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Erro na verificação: ' + error.response?.data?.error);
      setVerificationResult(null);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED': return '#00FF00';
      case 'FAILED': return '#FF0000';
      case 'Revoked': return '#FF0000';
      default: return '#FFFF00';
    }
  };

  const getAnomalyTypeColor = (type) => {
    switch (type) {
      case 'BOT': return '#FF0000';
      case 'DOS': return '#FF4444';
      case 'RATE_LIMIT': return '#FFAA00';
      default: return '#FFFFFF';
    }
  };

  return (
    <div className="company-page">
      <h2 style={{ color: '#00FF00' }}>Painel da Empresa</h2>
      <p>Valide usuários e monitore acessos à sua plataforma</p>

      <div className="card">
        <h3>Verificação de Usuário</h3>
        <p>Solicite a validação de pessoa real e confirme identidade segura</p>
        
        <input
          type="text"
          className="input"
          placeholder="DID do usuário (ex: did:example:123)"
          value={userDid}
          onChange={(e) => setUserDid(e.target.value)}
        />
        
        <input
          type="text"
          className="input"
          placeholder="VC ID do usuário"
          value={userVcId}
          onChange={(e) => setUserVcId(e.target.value)}
        />

        <button 
          className="btn" 
          onClick={handleVerifyUser} 
          disabled={loading}
          style={{ marginTop: '15px' }}
        >
          {loading ? 'Verificando...' : 'Verificar Usuário'}
        </button>
      </div>

      {verificationResult && (
        <div className="verification-box">
          <h3>Resultado da Verificação</h3>
          <p>
            <strong>Status:</strong> 
            <span style={{ color: getStatusColor(verificationResult.status), marginLeft: '10px' }}>
              {verificationResult.status}
            </span>
          </p>
          <p><strong>Resultado:</strong> {verificationResult.result}</p>
          {verificationResult.log_id && (
            <p><strong>Log ID:</strong> {verificationResult.log_id}</p>
          )}
        </div>
      )}

      <div className="card">
        <h3>Monitoramento de Acessos</h3>
        <p>Logs e métricas de tráfego - Bots e tráfegos indevidos bloqueados</p>
        
        <button 
          className="btn" 
          onClick={loadTrafficAnomalies}
          style={{ marginBottom: '20px' }}
        >
          Atualizar Logs
        </button>

        {anomalies.length > 0 ? (
          <div className="anomalies-list">
            <h4>Eventos Anômalos Detectados:</h4>
            {anomalies.slice(0, 10).map((anomaly) => (
              <div key={anomaly.anomaly_id} className="anomaly-item" style={{
                border: '1px solid #333',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '4px',
                backgroundColor: '#2a2a2a'
              }}>
                <p>
                  <strong>IP:</strong> {anomaly.source_ip} | 
                  <strong style={{ color: getAnomalyTypeColor(anomaly.anomaly_type), marginLeft: '10px' }}>
                    {anomaly.anomaly_type}
                  </strong>
                </p>
                <p>
                  <strong>Ação:</strong> {anomaly.action_taken} | 
                  <strong> Data:</strong> {new Date(anomaly.detection_timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#00FF00' }}>Nenhuma anomalia detectada recentemente</p>
        )}
      </div>

      <div className="card">
        <h3>Configuração de Integração</h3>
        <p>Estabeleça proteção automatizada para formulários/sistemas</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nível de Segurança:</label>
            <select className="input">
              <option>Alto</option>
              <option>Médio</option>
              <option>Baixo</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Timeout (ms):</label>
            <input type="number" className="input" defaultValue="5000" />
          </div>
        </div>

        <button className="btn" style={{ marginTop: '15px' }}>
          Salvar Configurações
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

export default CompanyPage;