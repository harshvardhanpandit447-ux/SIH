// Vercel Serverless Function entry point for AGRO VISION Express Backend
const app = require('../server/server');

module.exports = (req, res) => {
  // Normalize incoming URL to ensure Express /api routes match consistently
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
};

