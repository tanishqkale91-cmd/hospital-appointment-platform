const router = require('express').Router();
const mongoose = require('mongoose');

const STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];

router.get('/', (req, res) => {
  const state = mongoose.connection.readyState;
  const dbConnected = state === 1;
  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    message: dbConnected ? 'API is running' : 'API is running but the database is not connected',
    data: {
      status: 'ok',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      database: STATES[state] || 'unknown',
    },
  });
});

module.exports = router;
