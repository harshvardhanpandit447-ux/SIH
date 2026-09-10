-- ============================================================================
-- AGRO VISION - Supabase Database Schema & Tables
-- Project Reference: syguiyerrztsnstybxep
-- URL: https://syguiyerrztsnstybxep.supabase.co
-- Workflow: Farmer -> FPO -> Verified Buyer
-- ============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  mobile TEXT,
  role TEXT NOT NULL, -- 'FARMER', 'FPO', 'BUYER'
  password TEXT,
  village TEXT,
  taluka TEXT,
  district TEXT DEFAULT 'Pune',
  state TEXT DEFAULT 'Maharashtra',
  contact_person TEXT,
  registration_number TEXT,
  trust_score NUMERIC DEFAULT 90,
  aggregation_capacity TEXT,
  warehouse_location TEXT,
  verified BOOLEAN DEFAULT false,
  gstin TEXT,
  city TEXT,
  buyer_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FPOS TABLE
CREATE TABLE IF NOT EXISTS fpos (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  district TEXT DEFAULT 'Pune',
  taluka TEXT,
  hub_location TEXT,
  products JSONB DEFAULT '[]'::jsonb,
  categories JSONB DEFAULT '[]'::jsonb,
  aggregation_capacity TEXT,
  trust_score NUMERIC DEFAULT 90,
  verification_status TEXT DEFAULT 'PENDING_DOCUMENT_AUDIT',
  completed_trades INTEGER DEFAULT 0,
  storage_facility TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCES TABLE (Farmer produce submissions before aggregation)
CREATE TABLE IF NOT EXISTS produces (
  id TEXT PRIMARY KEY,
  farmer_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  farmer_name TEXT,
  farmer_mobile TEXT,
  commodity TEXT NOT NULL,
  category TEXT,
  quantity NUMERIC NOT NULL,
  unit TEXT DEFAULT 'Quintal',
  harvest_date TEXT,
  location TEXT,
  assigned_fpo_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  assigned_fpo_name TEXT,
  quality_grade TEXT,
  quality_confidence NUMERIC,
  ai_analysis JSONB,
  status TEXT DEFAULT 'SUBMITTED', -- SUBMITTED, UNDER_REVIEW, AGGREGATED, SOLD, PAID
  lot_id TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  estimated_net_realisation NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LOTS TABLE (FPO Aggregated Commercial Lots)
CREATE TABLE IF NOT EXISTS lots (
  id TEXT PRIMARY KEY,
  lot_number TEXT UNIQUE,
  fpo_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  fpo_name TEXT,
  fpo_trust_score NUMERIC,
  commodity TEXT NOT NULL,
  category TEXT,
  total_quantity NUMERIC NOT NULL,
  unit TEXT DEFAULT 'Quintal',
  quality_grade TEXT,
  quality_confidence NUMERIC,
  expected_price_per_quintal NUMERIC,
  min_acceptable_price NUMERIC,
  pickup_hub TEXT,
  location TEXT DEFAULT 'Pune',
  status TEXT DEFAULT 'OPEN_FOR_MATCHING', -- CREATED, OPEN_FOR_MATCHING, MATCHED_OFFER_ACTIVE, DEAL_CONFIRMED, IN_TRANSIT, DELIVERED, SETTLED
  participating_farmer_ids JSONB DEFAULT '[]'::jsonb,
  produce_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REQUIREMENTS TABLE (Verified Buyer purchase requirements)
CREATE TABLE IF NOT EXISTS requirements (
  id TEXT PRIMARY KEY,
  buyer_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  buyer_name TEXT,
  buyer_contact TEXT,
  buyer_trust_score NUMERIC,
  commodity TEXT NOT NULL,
  category TEXT,
  quantity NUMERIC NOT NULL,
  unit TEXT DEFAULT 'Quintal',
  required_grade TEXT,
  delivery_location TEXT,
  needed_by_date TEXT,
  target_price_per_quintal NUMERIC,
  max_price_per_quintal NUMERIC,
  status TEXT DEFAULT 'ACTIVE', -- ACTIVE, OFFER_IN_PROGRESS, FULFILLED
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. OFFERS TABLE (Negotiations between FPO and Buyer)
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  lot_id TEXT REFERENCES lots(id) ON DELETE CASCADE,
  lot_number TEXT,
  requirement_id TEXT REFERENCES requirements(id) ON DELETE SET NULL,
  fpo_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  fpo_name TEXT,
  buyer_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  buyer_name TEXT,
  commodity TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT DEFAULT 'Quintal',
  quality_grade TEXT,
  offered_price_per_quintal NUMERIC NOT NULL,
  buyer_counter_price NUMERIC,
  status TEXT DEFAULT 'OFFERED', -- OFFERED, BUYER_COUNTERED, ACCEPTED, REJECTED, CONVERTED_TO_DEAL
  delivery_terms TEXT,
  payment_terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TRANSACTIONS TABLE (Finalized deals and payouts)
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  deal_number TEXT UNIQUE,
  lot_id TEXT REFERENCES lots(id) ON DELETE SET NULL,
  lot_number TEXT,
  fpo_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  fpo_name TEXT,
  buyer_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  buyer_name TEXT,
  commodity TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT DEFAULT 'Quintal',
  agreed_rate_per_quintal NUMERIC NOT NULL,
  gross_total NUMERIC NOT NULL,
  logistics_cost NUMERIC DEFAULT 0,
  net_to_fpo NUMERIC NOT NULL,
  farmer_payout_status TEXT DEFAULT 'ESCROW_FUNDED',
  deal_status TEXT DEFAULT 'CONFIRMED',
  transporter TEXT,
  tracking_status TEXT,
  estimated_delivery TEXT,
  payout_breakdown JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MARKET_PRICES TABLE (APMC Mandi Rates)
CREATE TABLE IF NOT EXISTS market_prices (
  id TEXT PRIMARY KEY,
  commodity TEXT NOT NULL,
  category TEXT,
  mandi TEXT NOT NULL,
  district TEXT DEFAULT 'Pune',
  modal_price NUMERIC NOT NULL,
  min_price NUMERIC,
  max_price NUMERIC,
  unit TEXT DEFAULT '₹ / Quintal',
  arrivals_quintals NUMERIC,
  trend TEXT DEFAULT 'STABLE',
  last_updated TEXT DEFAULT 'Today',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  recipient_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT,
  read BOOLEAN DEFAULT false,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fpos ENABLE ROW LEVEL SECURITY;
ALTER TABLE produces ENABLE ROW LEVEL SECURITY;
ALTER TABLE lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access policies for demo/application keys
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow all access to users') THEN
    CREATE POLICY "Allow all access to users" ON users FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fpos' AND policyname = 'Allow all access to fpos') THEN
    CREATE POLICY "Allow all access to fpos" ON fpos FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'produces' AND policyname = 'Allow all access to produces') THEN
    CREATE POLICY "Allow all access to produces" ON produces FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lots' AND policyname = 'Allow all access to lots') THEN
    CREATE POLICY "Allow all access to lots" ON lots FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'requirements' AND policyname = 'Allow all access to requirements') THEN
    CREATE POLICY "Allow all access to requirements" ON requirements FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'offers' AND policyname = 'Allow all access to offers') THEN
    CREATE POLICY "Allow all access to offers" ON offers FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Allow all access to transactions') THEN
    CREATE POLICY "Allow all access to transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'market_prices' AND policyname = 'Allow all access to market_prices') THEN
    CREATE POLICY "Allow all access to market_prices" ON market_prices FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Allow all access to notifications') THEN
    CREATE POLICY "Allow all access to notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
