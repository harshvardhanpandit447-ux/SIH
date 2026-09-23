// Vercel Serverless Function entry point for AGRO VISION Express Backend
const app = require('../server/server');
const db = require('../server/database');

module.exports = async (req, res) => {
  // Ensure initial Supabase remote sync has finished if on a cold start
  if (db && db.initPromise) {
    try {
      await db.initPromise;
    } catch (e) {
      // Non-blocking fallback to local seed
    }
  }

  // Normalize incoming URL to ensure Express /api routes match consistently
  if (req.url) {
    if (req.url.startsWith('/api/index.js')) {
      req.url = req.url.replace('/api/index.js', '/api') || '/api';
    } else if (!req.url.startsWith('/api')) {
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }
  }
  return app(req, res);
};

