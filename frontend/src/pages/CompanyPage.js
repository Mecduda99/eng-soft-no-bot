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
      <h2 style={{ color: '#00FF00' }}>🏢 Painel da Empresa - Proteção Anti-Fraude</h2>
      <div className="intro-section" style={{ 
        padding: '20px', 
        border: '1px solid #00FF00', 
        borderRadius: '8px', 
        marginBottom: '30px',
        backgroundColor: '#1a1a1a'
      }}>
        <h3 style={{ color: '#00FF00', marginBottom: '15px' }}>🛡️ Proteja Sua Plataforma Contra Bots e Fraudes</h3>
        <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
          O sistema "Não Sou Robô" oferece proteção avançada contra bots, ataques automatizados 
          e fraudes digitais. Valide a humanidade dos seus usuários sem comprometer a privacidade deles.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '15px', border: '1px solid #333', borderRadius: '4px' }}>
            <strong style={{ color: '#00FF00' }}>🤖 Detecção de Bots:</strong><br/>
            Algoritmos avançados identificam padrões de comportamento não-humano
          </div>
          <div style={{ padding: '15px', border: '1px solid #333', borderRadius: '4px' }}>
            <strong style={{ color: '#00FF00' }}>📊 Monitoramento em Tempo Real:</strong><br/>
            Acompanhe tentativas de acesso suspeitas e bloqueios automáticos
          </div>
          <div style={{ padding: '15px', border: '1px solid #333', borderRadius: '4px' }}>
            <strong style={{ color: '#00FF00' }}>🔒 Verificação Segura:</strong><br/>
            Confirme identidades sem acessar dados pessoais dos usuários
          </div>
        </div>
      </div>

      <div className="card">
        <h3>✅ Verificação de Usuário - Confirme Humanidade</h3>
        <div style={{ 
          padding: '15px', 
          border: '1px solid #333', 
          borderRadius: '6px', 
          marginBottom: '15px',
          backgroundColor: '#2a2a2a'
        }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>Como funciona a verificação:</strong>
          </p>
          <ul style={{ marginLeft: '20px', lineHeight: '1.6' }}>
            <li>Usuário apresenta seu DID e credencial verificável</li>
            <li>Sistema valida a prova criptográfica de humanidade</li>
            <li>Resultado instantâneo: HUMANO ou BOT</li>
            <li>Nenhum dado pessoal é revelado no processo</li>
          </ul>
        </div>
        <p style={{ color: '#ccc', marginBottom: '15px' }}>
          Insira o DID e VC ID do usuário para verificar se é uma pessoa real:
        </p>
        
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
        <h3>📊 Monitoramento de Acessos - Inteligência Anti-Bot</h3>
        <div style={{ 
          padding: '15px', 
          border: '1px solid #333', 
          borderRadius: '6px', 
          marginBottom: '15px',
          backgroundColor: '#2a2a2a'
        }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>Tipos de ameaças detectadas automaticamente:</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            <div style={{ padding: '8px', border: '1px solid #FF0000', borderRadius: '4px', textAlign: 'center' }}>
              <strong style={{ color: '#FF0000' }}>BOT</strong><br/>
              <small>Scripts automatizados</small>
            </div>
            <div style={{ padding: '8px', border: '1px solid #FF4444', borderRadius: '4px', textAlign: 'center' }}>
              <strong style={{ color: '#FF4444' }}>DOS</strong><br/>
              <small>Ataques de negação</small>
            </div>
            <div style={{ padding: '8px', border: '1px solid #FFAA00', borderRadius: '4px', textAlign: 'center' }}>
              <strong style={{ color: '#FFAA00' }}>RATE_LIMIT</strong><br/>
              <small>Excesso de requisições</small>
            </div>
          </div>
        </div>
        <p style={{ color: '#ccc', marginBottom: '15px' }}>
          Visualize em tempo real todas as tentativas de acesso bloqueadas:
        </p>
        
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
        <h3>⚙️ Configuração de Integração - Proteção Automatizada</h3>
        <div style={{ 
          padding: '15px', 
          border: '1px solid #00FF00', 
          borderRadius: '6px', 
          marginBottom: '15px',
          backgroundColor: '#0a2a0a'
        }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>Integre facilmente com sua plataforma:</strong>
          </p>
          <ul style={{ marginLeft: '20px', lineHeight: '1.6' }}>
            <li><strong>API REST:</strong> Endpoints simples para verificação</li>
            <li><strong>Widget JavaScript:</strong> Componente plug-and-play</li>
            <li><strong>Webhook:</strong> Notificações em tempo real</li>
            <li><strong>SDK:</strong> Bibliotecas para várias linguagens</li>
          </ul>
        </div>
        <p style={{ color: '#ccc', marginBottom: '15px' }}>
          Configure o nível de segurança ideal para sua aplicação:
        </p>
        
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