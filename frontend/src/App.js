import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import CitizenPage from './pages/CitizenPage';
import CompanyPage from './pages/CompanyPage';
import GovernmentPage from './pages/GovernmentPage';

function App() {
  const [userType, setUserType] = useState('');

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 style={{ color: '#00FF00', fontSize: '2.5rem', marginBottom: '10px' }}>
            🛡️ Não Sou Robô - Plataforma Anti-Fraude Blockchain
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '5px' }}>
            Sistema Nacional de Identidade Digital Descentralizada
          </p>
          <p style={{ fontSize: '1rem', color: '#00FF00' }}>
            🔒 Zero-Knowledge Proofs | 🏛️ Gov.br/CIN | ⛓️ Blockchain Brasil
          </p>
        </header>

        <nav className="navigation">
          <Link to="/citizen" className="nav-link">Cidadão</Link>
          <Link to="/company" className="nav-link">Empresa</Link>
          <Link to="/government" className="nav-link">Governo</Link>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/citizen" element={<CitizenPage />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/government" element={<GovernmentPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="home-page">
      <div className="card">
        <h2>🛡️ Plataforma "Não Sou Robô" - Sistema Anti-Fraude Blockchain</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '20px', lineHeight: '1.6' }}>
          Solução completa de <strong>identidade digital segura</strong> que combate fraudes, 
          elimina bots e preserva sua privacidade usando tecnologia blockchain e Zero-Knowledge Proofs.
        </p>
        
        <div style={{ 
          padding: '25px', 
          border: '2px solid #00FF00', 
          borderRadius: '10px', 
          backgroundColor: '#0a2a0a',
          marginBottom: '30px'
        }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', textAlign: 'justify' }}>
            A plataforma <strong>"Não Sou Robô"</strong> representa uma revolução na segurança digital brasileira, 
            estabelecendo um ecossistema nacional de identidade descentralizada que elimina a dependência de 
            big techs estrangeiras. Através da integração nativa com <strong>Gov.br e CIN</strong>, oferecemos 
            aos cidadãos controle total sobre sua identidade digital, às empresas proteção definitiva contra 
            bots e fraudes, e ao governo ferramentas de governança que garantem <strong>conformidade LGPD</strong> 
            sem comprometer a privacidade. Nossa tecnologia de <strong>Zero-Knowledge Proofs</strong> permite 
            provar humanidade sem revelar dados pessoais, enquanto a <strong>infraestrutura blockchain nacional</strong> 
            assegura soberania digital e independência tecnológica para o Brasil.
          </p>
        </div>
        
        <div className="features-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '40px' 
        }}>
          <div className="feature-item" style={{ padding: '20px', border: '1px solid #333', borderRadius: '8px' }}>
            <h4 style={{ color: '#00FF00', marginBottom: '10px' }}>🔐 Identidade Descentralizada</h4>
            <p>Crie sua identidade digital (DID) sem depender de terceiros. Você controla seus dados.</p>
          </div>
          
          <div className="feature-item" style={{ padding: '20px', border: '1px solid #333', borderRadius: '8px' }}>
            <h4 style={{ color: '#00FF00', marginBottom: '10px' }}>🤖 Detecção de Bots</h4>
            <p>Sistema inteligente que identifica e bloqueia automaticamente bots e tráfego malicioso.</p>
          </div>
          
          <div className="feature-item" style={{ padding: '20px', border: '1px solid #333', borderRadius: '8px' }}>
            <h4 style={{ color: '#00FF00', marginBottom: '10px' }}>🔒 Privacidade Total</h4>
            <p>Prove que você é humano sem revelar dados pessoais usando Zero-Knowledge Proofs.</p>
          </div>
          
          <div className="feature-item" style={{ padding: '20px', border: '1px solid #333', borderRadius: '8px' }}>
            <h4 style={{ color: '#00FF00', marginBottom: '10px' }}>🏛️ Integração Gov.br</h4>
            <p>Vinculação oficial com Gov.br e CIN para máxima confiabilidade e conformidade legal.</p>
          </div>
        </div>

        <h3 style={{ marginBottom: '20px' }}>Selecione seu perfil de acesso:</h3>
        
        <div className="user-types">
          <Link to="/citizen" className="user-type-card">
            <h3>👤 Cidadão</h3>
            <p><strong>Crie sua identidade digital segura</strong></p>
            <ul style={{ textAlign: 'left', marginTop: '10px' }}>
              <li>Gerar DID descentralizado</li>
              <li>Vincular com Gov.br/CIN</li>
              <li>Emitir credenciais verificáveis</li>
              <li>Provar humanidade com privacidade</li>
            </ul>
          </Link>
          
          <Link to="/company" className="user-type-card">
            <h3>🏢 Empresa</h3>
            <p><strong>Proteja sua plataforma contra fraudes</strong></p>
            <ul style={{ textAlign: 'left', marginTop: '10px' }}>
              <li>Verificar usuários reais</li>
              <li>Bloquear bots automaticamente</li>
              <li>Monitorar tráfego suspeito</li>
              <li>Configurar proteção de formulários</li>
            </ul>
          </Link>
          
          <Link to="/government" className="user-type-card">
            <h3>🏛️ Governo</h3>
            <p><strong>Defina padrões e monitore conformidade</strong></p>
            <ul style={{ textAlign: 'left', marginTop: '10px' }}>
              <li>Certificar formatos de identidade</li>
              <li>Monitorar conformidade LGPD</li>
              <li>Gerenciar infraestrutura blockchain</li>
              <li>Definir políticas de validação</li>
            </ul>
          </Link>
        </div>
        
        <div className="how-it-works" style={{ 
          marginTop: '40px', 
          padding: '30px', 
          border: '2px solid #00FF00', 
          borderRadius: '10px',
          backgroundColor: '#1a1a1a'
        }}>
          <h3 style={{ color: '#00FF00', marginBottom: '20px' }}>🔄 Como Funciona</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>1️⃣</div>
              <h4>Criar Identidade</h4>
              <p>Cidadão cria DID e vincula com Gov.br</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>2️⃣</div>
              <h4>Gerar Prova</h4>
              <p>Sistema cria prova de humanidade sem expor dados</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>3️⃣</div>
              <h4>Verificar</h4>
              <p>Empresa valida usuário e bloqueia bots</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>4️⃣</div>
              <h4>Monitorar</h4>
              <p>Governo monitora conformidade e segurança</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;