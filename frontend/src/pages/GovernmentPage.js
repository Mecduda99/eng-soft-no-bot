import React, { useState, useEffect } from 'react';
import { identityService, revocationService, monitoringService } from '../services/api';

function GovernmentPage() {
  const [identities, setIdentities] = useState([]);
  const [revocations, setRevocations] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchDid, setSearchDid] = useState('');
  const [searchVcId, setSearchVcId] = useState('');

  useEffect(() => {
    loadMonitoringData();
  }, []);

  const loadMonitoringData = async () => {
    setLoading(true);
    try {
      const anomaliesResponse = await monitoringService.getTrafficAnomalies();
      setAnomalies(anomaliesResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
    setLoading(false);
  };

  const handleSearchIdentity = async () => {
    if (!searchDid) return;
    setLoading(true);
    try {
      const response = await identityService.getIdentity(searchDid);
      setIdentities([response.data]);
      setMessage('');
    } catch (error) {
      setMessage('Identidade não encontrada');
      setIdentities([]);
    }
    setLoading(false);
  };

  const handleSearchRevocation = async () => {
    if (!searchVcId) return;
    setLoading(true);
    try {
      const response = await revocationService.getRevocationStatus(searchVcId);
      setRevocations([response.data]);
      setMessage('');
    } catch (error) {
      setMessage('Revogação não encontrada');
      setRevocations([]);
    }
    setLoading(false);
  };

  const getComplianceStatus = (identity) => {
    if (identity.gov_link_status === 'LINKED') {
      return { status: 'Conforme', color: '#00FF00' };
    }
    return { status: 'Pendente', color: '#FFFF00' };
  };

  return (
    <div className="government-page">
      <h2 style={{ color: '#00FF00' }}>Painel do Governo</h2>
      <p>Monitore identidades, defina padrões e garanta conformidade regulatória</p>

      <div className="card">
        <h3>Definição de Padrões</h3>
        <p>Configure modos de integração Gov.br e CIN</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '10px' }}>Formato de Identidade Digital:</label>
            <select className="input">
              <option>DID W3C Padrão</option>
              <option>DID Gov.br Customizado</option>
              <option>DID CIN Integrado</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '10px' }}>Nível de Validação:</label>
            <select className="input">
              <option>Alto (Biometria + Documentos)</option>
              <option>Médio (Documentos)</option>
              <option>Básico (Declaratório)</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>Período de Validade (dias):</label>
          <input type="number" className="input" defaultValue="365" />
        </div>

        <button className="btn" style={{ marginTop: '20px' }}>
          Certificar Formatos de Identidade Digital
        </button>
      </div>

      <div className="card">
        <h3>Monitoramento de Identidades</h3>
        <p>Consulte e monitore identidades para garantir conformidade LGPD</p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            className="input"
            placeholder="DID para consulta"
            value={searchDid}
            onChange={(e) => setSearchDid(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn" onClick={handleSearchIdentity} disabled={loading}>
            Consultar Identidade
          </button>
        </div>

        {identities.length > 0 && (
          <div className="monitoring-results">
            <h4>Identidades Encontradas:</h4>
            {identities.map((identity) => {
              const compliance = getComplianceStatus(identity);
              return (
                <div key={identity.did} style={{
                  border: '1px solid #333',
                  padding: '15px',
                  margin: '10px 0',
                  borderRadius: '4px',
                  backgroundColor: '#2a2a2a'
                }}>
                  <p><strong>DID:</strong> {identity.did}</p>
                  <p><strong>Status Gov.br:</strong> {identity.gov_link_status}</p>
                  <p><strong>Referência:</strong> {identity.gov_id_ref || 'N/A'}</p>
                  <p>
                    <strong>Conformidade LGPD:</strong> 
                    <span style={{ color: compliance.color, marginLeft: '10px' }}>
                      {compliance.status}
                    </span>
                  </p>
                  <p><strong>Criado:</strong> {new Date(identity.creation_timestamp).toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Monitoramento de Revogações</h3>
        <p>Acompanhe credenciais revogadas e status blockchain</p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            className="input"
            placeholder="VC ID para consulta"
            value={searchVcId}
            onChange={(e) => setSearchVcId(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn" onClick={handleSearchRevocation} disabled={loading}>
            Consultar Revogação
          </button>
        </div>

        {revocations.length > 0 && (
          <div className="revocation-results">
            <h4>Revogações Encontradas:</h4>
            {revocations.map((revocation) => (
              <div key={revocation.vc_id} style={{
                border: '1px solid #333',
                padding: '15px',
                margin: '10px 0',
                borderRadius: '4px',
                backgroundColor: '#2a2a2a'
              }}>
                <p><strong>VC ID:</strong> {revocation.vc_id}</p>
                <p><strong>Motivo:</strong> {revocation.reason}</p>
                <p><strong>Data:</strong> {new Date(revocation.revocation_date).toLocaleString()}</p>
                <p>
                  <strong>Status Blockchain:</strong> 
                  <span style={{ 
                    color: revocation.blockchain_update_status === 'COMPLETED' ? '#00FF00' : '#FFFF00',
                    marginLeft: '10px'
                  }}>
                    {revocation.blockchain_update_status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Infraestrutura Blockchain</h3>
        <p>Status e configurações da infraestrutura blockchain aplicável</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#00FF00' }}>Nós Ativos</h4>
            <p style={{ fontSize: '2rem', color: '#00FF00' }}>12</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#00FF00' }}>Transações/Dia</h4>
            <p style={{ fontSize: '2rem', color: '#00FF00' }}>1,247</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: '#00FF00' }}>Uptime</h4>
            <p style={{ fontSize: '2rem', color: '#00FF00' }}>99.9%</p>
          </div>
        </div>

        <button className="btn" style={{ marginTop: '20px' }}>
          Atualizar Configurações Blockchain
        </button>
      </div>

      <div className="card">
        <h3>Eventos Anômalos do Sistema</h3>
        <button 
          className="btn" 
          onClick={loadMonitoringData}
          style={{ marginBottom: '15px' }}
        >
          Atualizar Dados
        </button>
        
        {anomalies.length > 0 ? (
          <div>
            <p><strong>Total de anomalias detectadas:</strong> {anomalies.length}</p>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {anomalies.slice(0, 5).map((anomaly) => (
                <div key={anomaly.anomaly_id} style={{
                  border: '1px solid #333',
                  padding: '10px',
                  margin: '5px 0',
                  borderRadius: '4px',
                  backgroundColor: '#2a2a2a'
                }}>
                  <p><strong>Tipo:</strong> {anomaly.anomaly_type} | <strong>IP:</strong> {anomaly.source_ip}</p>
                  <p><strong>Ação:</strong> {anomaly.action_taken} | <strong>Data:</strong> {new Date(anomaly.detection_timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ color: '#00FF00' }}>Sistema operando normalmente</p>
        )}
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

export default GovernmentPage;