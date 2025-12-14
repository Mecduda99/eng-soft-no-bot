const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const Database = require('./shared/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = new Database('edge-middleware');

// Database is already initialized by setup script
async function initDatabase() {
  console.log('Using edge-middleware database');
}

// Bot detection middleware
const botDetection = async (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const sourceIp = req.ip || req.connection.remoteAddress;
  
  // Simulação de detecção de bot
  const isSuspicious = userAgent.toLowerCase().includes('bot') || 
                      userAgent.toLowerCase().includes('crawler') ||
                      !userAgent;
  
  if (isSuspicious) {
    await db.run(
      'INSERT INTO traffic_anomalies (source_ip, detection_timestamp, anomaly_type, action_taken) VALUES (?, ?, ?, ?)',
      [sourceIp, Date.now(), 'BOT', 'BLOCKED']
    );
    
    return res.status(403).json({ 
      error: 'Bot detectado - Acesso negado',
      message: 'Tráfego suspeito bloqueado pelo Edge-Middleware'
    });
  }
  
  next();
};

// Apply bot detection to all routes
app.use(botDetection);

// Proxy configuration for microservices
const services = {
  identity: 'http://localhost:3001',
  proof: 'http://localhost:3002',
  revocation: 'http://localhost:3003'
};

// Route proxying
app.use('/api/identities', createProxyMiddleware({
  target: services.identity,
  changeOrigin: true,
  pathRewrite: { '^/api/identities': '/identities' }
}));

app.use('/api/proofs', createProxyMiddleware({
  target: services.proof,
  changeOrigin: true,
  pathRewrite: { '^/api/proofs': '/proofs' }
}));

app.use('/api/revocations', createProxyMiddleware({
  target: services.revocation,
  changeOrigin: true,
  pathRewrite: { '^/api/revocations': '/revocations' }
}));

// Gateway health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'API Gateway',
    services: services
  });
});

// Traffic monitoring endpoint
app.get('/api/monitoring/anomalies', async (req, res) => {
  try {
    const anomalies = await db.all(
      'SELECT * FROM traffic_anomalies ORDER BY detection_timestamp DESC LIMIT 100'
    );
    res.json(anomalies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`API Gateway running on port ${PORT}`);
      console.log('Proxying to services:', services);
    });
  } catch (error) {
    console.error('Failed to start API Gateway:', error);
  }
}

startServer();