const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const Database = require('../shared/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const db = new Database('edge-middleware');

// Database is already initialized by setup script
async function initDatabase() {
  console.log('Using edge-middleware database');
}

// Bot detection middleware
const botDetection = async (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const sourceIp = req.ip || req.connection.remoteAddress || 'unknown';
  
  // Enhanced bot detection
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /curl/i, /wget/i, /python/i, /java/i
  ];
  
  const isSuspicious = !userAgent || 
                      userAgent.length < 10 || 
                      botPatterns.some(pattern => pattern.test(userAgent)) ||
                      req.headers['x-forwarded-for']?.split(',').length > 3;
  
  if (isSuspicious) {
    console.warn(`Suspicious traffic detected from ${sourceIp}: ${userAgent}`);
    
    try {
      await db.run(
        'INSERT INTO traffic_anomalies (source_ip, detection_timestamp, anomaly_type, action_taken) VALUES (?, ?, ?, ?)',
        [sourceIp, Date.now(), 'BOT', 'BLOCKED']
      );
    } catch (error) {
      console.error('Failed to log anomaly:', error);
    }
    
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