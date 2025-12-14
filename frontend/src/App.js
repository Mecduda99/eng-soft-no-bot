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
          <h1 style={{ color: '#00FF00' }}>Plataforma Anti-Fraude Blockchain</h1>
          <p>Não Sou Robô - Identidade Digital Segura</p>
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
        <h2>Bem-vindo à Plataforma "Não Sou Robô"</h2>
        <p>Selecione seu tipo de usuário para acessar as funcionalidades:</p>
        
        <div className="user-types">
          <Link to="/citizen" className="user-type-card">
            <h3>Cidadão</h3>
            <p>Gerencie sua identidade digital e credenciais</p>
          </Link>
          
          <Link to="/company" className="user-type-card">
            <h3>Empresa</h3>
            <p>Valide usuários e monitore acessos</p>
          </Link>
          
          <Link to="/government" className="user-type-card">
            <h3>Governo</h3>
            <p>Monitore identidades e defina padrões</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;