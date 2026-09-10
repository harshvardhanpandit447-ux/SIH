/**
 * AGRO VISION - Supabase Database Client & Sync Bridge
 * Connects directly to Supabase Postgres instance (Project: syguiyerrztsnstybxep)
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://syguiyerrztsnstybxep.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z3VpeWVycnp0c25zdHlieGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NTgyMzAsImV4cCI6MjEwNDUzNDIzMH0.bJ6T2dsCeKbyf2RgmOtmegbSdEukEkByr7E6fgk6FxQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false
  }
});

// Collection to Supabase table name mapping
const TABLE_MAP = {
  users: 'users',
  fpos: 'fpos',
  produces: 'produces',
  lots: 'lots',
  requirements: 'requirements',
  offers: 'offers',
  transactions: 'transactions',
  marketPrices: 'market_prices',
  notifications: 'notifications',
  disputes: 'disputes',
  adminLogs: 'admin_logs'
};

// Case transformation helpers
function toSnakeCase(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
}

function objectToSnake(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = toSnakeCase(key);
    // Don't convert inner objects of JSONB fields if they are domain data (keep as is)
    newObj[snakeKey] = value;
  }
  return newObj;
}

function objectToCamel(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    newObj[camelKey] = value;
  }
  return newObj;
}

/**
 * Fetch all records for all collections from Supabase
 */
async function fetchAllCollections() {
  const result = {};
  for (const [collection, tableName] of Object.entries(TABLE_MAP)) {
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) {
        console.warn(`[Supabase] Could not fetch ${tableName}:`, error.message);
        result[collection] = null;
      } else {
        result[collection] = data.map(objectToCamel);
      }
    } catch (err) {
      console.warn(`[Supabase] Error querying ${tableName}:`, err.message);
      result[collection] = null;
    }
  }
  return result;
}

/**
 * Upsert a single record into Supabase
 */
async function syncRecord(collection, item) {
  const tableName = TABLE_MAP[collection];
  if (!tableName || !item || !item.id) return;

  try {
    const row = objectToSnake(item);
    const { error } = await supabase
      .from(tableName)
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error(`[Supabase] Error upserting into ${tableName}:`, error.message);
    } else {
      // console.log(`[Supabase] Synced ${tableName} record: ${item.id}`);
    }
  } catch (err) {
    console.error(`[Supabase] Network/Sync exception on ${tableName}:`, err.message);
  }
}

/**
 * Delete a record from Supabase
 */
async function deleteRecord(collection, id) {
  const tableName = TABLE_MAP[collection];
  if (!tableName || !id) return;

  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`[Supabase] Error deleting from ${tableName}:`, error.message);
    }
  } catch (err) {
    console.error(`[Supabase] Network/Sync exception deleting from ${tableName}:`, err.message);
  }
}

/**
 * Reset all tables in Supabase with initial seed data
 */
async function resetSupabaseTables(seedDb) {
  console.log('[Supabase] Resetting Supabase tables with initial seed data...');
  for (const [collection, tableName] of Object.entries(TABLE_MAP)) {
    try {
      const items = seedDb[collection] || [];
      if (items.length > 0) {
        const rows = items.map(objectToSnake);
        await supabase.from(tableName).delete().neq('id', '___non_existent___');
        await supabase.from(tableName).upsert(rows);
      }
    } catch (err) {
      console.error(`[Supabase] Error resetting ${tableName}:`, err.message);
    }
  }
  console.log('[Supabase] Reset completed successfully.');
}

module.exports = {
  supabase,
  SUPABASE_URL,
  TABLE_MAP,
  objectToSnake,
  objectToCamel,
  fetchAllCollections,
  syncRecord,
  deleteRecord,
  resetSupabaseTables
};
