import express from 'express';

// Simple health check server to satisfy Koyeb requirements
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'crypto-prediction-bot',
    timestamp: new Date().toISOString() 
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Crypto Prediction Bot is running',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

export function startHealthServer() {
  app.listen(PORT, () => {
    console.log(`🏥 Health check server running on port ${PORT}`);
  });
}
