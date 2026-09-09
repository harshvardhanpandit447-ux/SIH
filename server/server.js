/**
 * AGRO VISION - Main REST API Server
 * 
 * Strict Stakeholder Flow: FARMER → FPO → VERIFIED BUYER
 * Farmers never interact directly with buyers.
 */

const express = require('express');
const cors = require('cors');
const db = require('./database');
const {
  COMMODITY_PROFILES,
  predictFuturePrice,
  calculateNetRealisation,
  assessProduceQuality,
  calculateBuyerLotMatch
} = require('./mlEngine');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '15mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/* ==========================================================================
   HEALTH & SYSTEM
   ========================================================================== */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'AGRO VISION',
    tagline: 'Smart Farming. Better Markets. Better Returns.',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/system/reset-demo', (req, res) => {
  const fresh = db.resetToSeed();
  res.json({ success: true, message: 'Database reset to Pune agricultural seed state', data: fresh });
});

/* ==========================================================================
   AUTHENTICATION & PROFILE
   ========================================================================== */
// Login endpoint with demo auto-detect
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = db.getCollection('users');
  
  const user = users.find(u => 
    (u.email && u.email.toLowerCase() === (email || '').toLowerCase()) ||
    (u.mobile && u.mobile === email)
  );

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid mobile/email or password' });
  }

  // Generate session token (mock secure string for demo)
  const token = `agv_token_${user.id}_${Date.now()}`;
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      village: user.village,
      district: user.district,
      state: user.state,
      trustScore: user.trustScore || 90
    }
  });
});

// Registration endpoint - STRICT SEPARATION OF BASIC PROFILE
app.post('/api/auth/register', (req, res) => {
  const { role, name, mobile, email, password, village, district, state, registrationNumber, companyName, gstin } = req.body;

  if (!role || !name || !mobile || !password) {
    return res.status(400).json({ error: 'Name, mobile, role and password are required' });
  }

  const existingUsers = db.getCollection('users');
  if (existingUsers.some(u => u.mobile === mobile)) {
    return res.status(400).json({ error: 'An account with this mobile number already exists' });
  }

  const newUser = db.insert('users', {
    name: role === 'BUYER' && companyName ? companyName : name,
    contactPerson: role !== 'FARMER' ? name : undefined,
    mobile,
    email: email || '',
    role,
    password, // in real production use bcrypt
    village: village || '',
    taluka: req.body.taluka || '',
    district: district || 'Pune',
    state: state || 'Maharashtra',
    registrationNumber: registrationNumber || '',
    gstin: gstin || '',
    trustScore: role === 'FARMER' ? 88 : 90
  });

  // If FPO, add to FPO directory
  if (role === 'FPO') {
    db.insert('fpos', {
      userId: newUser.id,
      name: newUser.name,
      district: newUser.district,
      taluka: newUser.taluka || 'Haveli',
      hubLocation: `${newUser.district} Agricultural Cluster`,
      products: ['Vegetables', 'Fruits', 'Field Crops'],
      categories: ['Vegetables', 'Fruits'],
      aggregationCapacity: '300 Quintals/week',
      trustScore: 90,
      verificationStatus: 'PENDING_DOCUMENT_AUDIT',
      completedTrades: 0,
      storageFacility: 'Standard Aggregation Center'
    });
  }

  res.json({
    success: true,
    message: `${role} registered successfully. Welcome to AGRO VISION.`,
    user: newUser
  });
});

/* ==========================================================================
   ML INTELLIGENCE & COMPUTER VISION ENDPOINTS
   ========================================================================== */
// 1. Future Price Prediction ML Model
app.post('/api/ml/predict-price', (req, res) => {
  const { commodity, mandi, horizonWeeks, currentPrice } = req.body;
  const prediction = predictFuturePrice(commodity, mandi, horizonWeeks, currentPrice);
  res.json(prediction);
});

// 2. Net Realisation Calculation Engine
app.post('/api/ml/net-realisation', (req, res) => {
  const result = calculateNetRealisation(req.body);
  res.json(result);
});

// 3. AI Quality Assessment & Good Quality Detection ML Model
app.post('/api/ml/assess-quality', (req, res) => {
  const { commodity, imageInfo } = req.body;
  const assessment = assessProduceQuality(commodity, imageInfo);
  res.json(assessment);
});

/* ==========================================================================
   MARKET INTELLIGENCE & MANDI RATES
   ========================================================================== */
app.get('/api/market/prices', (req, res) => {
  const prices = db.getCollection('marketPrices');
  res.json(prices);
});

app.get('/api/fpos/list', (req, res) => {
  const fpos = db.getCollection('fpos');
  res.json(fpos);
});

/* ==========================================================================
   FARMER EXPERIENCE
   Farmers submit produce to FPO. Never directly to buyers.
   ========================================================================== */
// Get farmer's produce submissions
app.get('/api/farmer/produce/:farmerId', (req, res) => {
  const { farmerId } = req.params;
  const allProduce = db.getCollection('produces');
  const farmerProduce = allProduce.filter(p => p.farmerId === farmerId);
  res.json(farmerProduce);
});

// Farmer adds produce (Crop, quantity, harvest date, location, photos, FPO selection)
app.post('/api/farmer/produce', (req, res) => {
  const {
    farmerId,
    farmerName,
    farmerMobile,
    commodity,
    category,
    quantity,
    unit,
    harvestDate,
    location,
    assignedFpoId,
    assignedFpoName,
    qualityGrade,
    qualityConfidence,
    photoUrl,
    estimatedPrice
  } = req.body;

  if (!farmerId || !commodity || !quantity) {
    return res.status(400).json({ error: 'Commodity and expected quantity are required' });
  }

  // Pre-calculate estimated net realisation
  const netEstimate = calculateNetRealisation({ grossPrice: estimatedPrice || 2800 });

  const record = db.insert('produces', {
    farmerId,
    farmerName: farmerName || 'Demo Farmer',
    farmerMobile: farmerMobile || '9822012345',
    commodity,
    category: category || 'Vegetables',
    quantity: Number(quantity),
    unit: unit || 'Quintal',
    harvestDate: harvestDate || new Date().toISOString().split('T')[0],
    location: location || 'Pune, Maharashtra',
    assignedFpoId: assignedFpoId || 'usr_fpo_01',
    assignedFpoName: assignedFpoName || 'Shivneri Agri Farmers Producer Co.',
    qualityGrade: qualityGrade || 'Grade A',
    qualityConfidence: qualityConfidence || 92,
    photoUrl: photoUrl || '',
    status: 'SUBMITTED', // SUBMITTED -> UNDER_REVIEW -> AGGREGATED -> SOLD -> PAID
    estimatedNetRealisation: netEstimate.netRealisation,
    submittedAt: new Date().toISOString()
  });

  // Notify the assigned FPO of incoming produce request
  db.insert('notifications', {
    recipientId: record.assignedFpoId,
    title: 'New Farmer Produce Request',
    message: `${record.farmerName} submitted ${record.quantity} ${record.unit} of ${record.commodity} (${record.qualityGrade}).`,
    type: 'NEW_PRODUCE_SUBMISSION'
  });

  res.json({
    success: true,
    message: 'Produce submitted successfully to your designated FPO for aggregation and quality check.',
    produce: record
  });
});

/* ==========================================================================
   FPO EXPERIENCE
   FPO is the central bridge: aggregates farmer produce into lots & deals with buyers.
   ========================================================================== */
// Get FPO dashboard data
app.get('/api/fpo/dashboard/:fpoId', (req, res) => {
  const { fpoId } = req.params;
  const produces = db.getCollection('produces').filter(p => p.assignedFpoId === fpoId || p.assignedFpoId === 'usr_fpo_01');
  const lots = db.getCollection('lots').filter(l => l.fpoId === fpoId || l.fpoId === 'usr_fpo_01');
  const offers = db.getCollection('offers').filter(o => o.fpoId === fpoId || o.fpoId === 'usr_fpo_01');
  const transactions = db.getCollection('transactions').filter(t => t.fpoId === fpoId || t.fpoId === 'usr_fpo_01');
  const requirements = db.getCollection('requirements');

  res.json({
    incomingFarmerRequests: produces.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW'),
    aggregatedProduceCount: produces.filter(p => p.status === 'AGGREGATED').length,
    activeLots: lots,
    openBuyerRequirements: requirements,
    activeOffers: offers,
    transactions
  });
});

// FPO aggregates farmer produces into a commercial Lot
app.post('/api/fpo/create-lot', (req, res) => {
  const {
    fpoId,
    fpoName,
    commodity,
    category,
    selectedProduceIds,
    expectedPricePerQuintal,
    minAcceptablePrice,
    qualityGrade,
    pickupHub,
    location
  } = req.body;

  if (!fpoId || !commodity || !selectedProduceIds || !selectedProduceIds.length) {
    return res.status(400).json({ error: 'FPO ID, commodity, and at least one farmer produce are required' });
  }

  // Calculate total aggregated quantity from selected produces
  const allProduce = db.getCollection('produces');
  const selectedItems = allProduce.filter(p => selectedProduceIds.includes(p.id));
  const totalQuantity = selectedItems.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
  const participatingFarmerIds = [...new Set(selectedItems.map(p => p.farmerId))];

  const lotNumber = `LOT-PUN-${commodity.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`;

  const newLot = db.insert('lots', {
    lotNumber,
    fpoId,
    fpoName: fpoName || 'Shivneri Agri Farmers Producer Co.',
    fpoTrustScore: 94,
    commodity,
    category: category || 'Vegetables',
    totalQuantity,
    unit: 'Quintal',
    qualityGrade: qualityGrade || 'Grade A',
    qualityConfidence: 93,
    expectedPricePerQuintal: Number(expectedPricePerQuintal) || 2850,
    minAcceptablePrice: Number(minAcceptablePrice) || 2750,
    pickupHub: pickupHub || 'Narayangaon FPO Aggregation Center, Pune',
    location: location || 'Pune',
    status: 'OPEN_FOR_MATCHING',
    participatingFarmerIds,
    produceIds: selectedProduceIds
  });

  // Mark selected farmer produces as AGGREGATED and link lotId
  selectedProduceIds.forEach(id => {
    db.updateById('produces', id, {
      status: 'AGGREGATED',
      lotId: newLot.id,
      aggregatedLotNumber: lotNumber
    });
  });

  // Notify participating farmers
  participatingFarmerIds.forEach(fId => {
    db.insert('notifications', {
      recipientId: fId,
      title: 'Produce Aggregated into Lot',
      message: `Your produce has been bundled into Commercial ${lotNumber} by your FPO.`,
      type: 'PRODUCE_AGGREGATED'
    });
  });

  res.json({
    success: true,
    message: `Successfully aggregated ${totalQuantity} Quintals into ${lotNumber}`,
    lot: newLot
  });
});

/* ==========================================================================
   BUYER EXPERIENCE
   Buyers interact strictly with FPOs and browse aggregated lots.
   ========================================================================== */
// Buyer posts procurement requirement
app.post('/api/buyer/requirements', (req, res) => {
  const {
    buyerId,
    buyerName,
    buyerContact,
    commodity,
    category,
    quantity,
    unit,
    requiredGrade,
    deliveryLocation,
    neededByDate,
    targetPricePerQuintal,
    maxPricePerQuintal
  } = req.body;

  if (!buyerId || !commodity || !quantity) {
    return res.status(400).json({ error: 'Commodity and required quantity are required' });
  }

  const reqRecord = db.insert('requirements', {
    buyerId,
    buyerName: buyerName || 'Sahyadri Fresh Wholesale Pvt Ltd',
    buyerContact: buyerContact || 'Rajesh Mehta',
    buyerTrustScore: 92,
    commodity,
    category: category || 'Vegetables',
    quantity: Number(quantity),
    unit: unit || 'Quintal',
    requiredGrade: requiredGrade || 'Grade A',
    deliveryLocation: deliveryLocation || 'Pune Market Yard',
    neededByDate: neededByDate || '2026-03-20',
    targetPricePerQuintal: Number(targetPricePerQuintal) || 2800,
    maxPricePerQuintal: Number(maxPricePerQuintal) || 2900,
    status: 'ACTIVE'
  });

  res.json({
    success: true,
    message: 'Procurement demand posted. Matching engine will identify suitable FPO aggregated lots.',
    requirement: reqRecord
  });
});

// Get buyer dashboard and matched lots
app.get('/api/buyer/dashboard/:buyerId', (req, res) => {
  const { buyerId } = req.params;
  const requirements = db.getCollection('requirements').filter(r => r.buyerId === buyerId || r.buyerId === 'usr_buyer_01');
  const allLots = db.getCollection('lots');
  const offers = db.getCollection('offers').filter(o => o.buyerId === buyerId || o.buyerId === 'usr_buyer_01');
  const transactions = db.getCollection('transactions').filter(t => t.buyerId === buyerId || t.buyerId === 'usr_buyer_01');

  // Run matching engine for each buyer requirement against open FPO lots
  const matchedLots = [];
  requirements.forEach(reqItem => {
    allLots.forEach(lot => {
      const match = calculateBuyerLotMatch(lot, reqItem);
      if (match.isMatch || match.matchScore > 50) {
        matchedLots.push({
          lot,
          matchedRequirement: reqItem,
          matchScore: match.matchScore,
          matchRationale: match.rationale
        });
      }
    });
  });

  res.json({
    requirements,
    matchedLots,
    offers,
    transactions
  });
});

/* ==========================================================================
   OFFERS, NEGOTIATION & TRANSACTION FLOW (FPO ↔ BUYER)
   ========================================================================== */
// Buyer or FPO sends offer
app.post('/api/offers', (req, res) => {
  const {
    lotId,
    requirementId,
    fpoId,
    fpoName,
    buyerId,
    buyerName,
    commodity,
    quantity,
    offeredPricePerQuintal,
    buyerCounterPrice,
    deliveryTerms,
    paymentTerms
  } = req.body;

  const lot = db.findById('lots', lotId);

  const offer = db.insert('offers', {
    lotId,
    lotNumber: lot ? lot.lotNumber : 'LOT-PUN-ON-2026-01',
    requirementId,
    fpoId: fpoId || (lot ? lot.fpoId : 'usr_fpo_01'),
    fpoName: fpoName || (lot ? lot.fpoName : 'Shivneri Agri Farmers Producer Co.'),
    buyerId: buyerId || 'usr_buyer_01',
    buyerName: buyerName || 'Sahyadri Fresh Wholesale Pvt Ltd',
    commodity: commodity || (lot ? lot.commodity : 'Onion'),
    quantity: Number(quantity) || 100,
    unit: 'Quintal',
    qualityGrade: lot ? lot.qualityGrade : 'Grade A',
    offeredPricePerQuintal: Number(offeredPricePerQuintal) || 2850,
    buyerCounterPrice: buyerCounterPrice ? Number(buyerCounterPrice) : null,
    status: buyerCounterPrice ? 'BUYER_COUNTERED' : 'OFFERED',
    deliveryTerms: deliveryTerms || 'Ex-FPO Warehouse (FPO coordinates verified transport)',
    paymentTerms: paymentTerms || '100% Escrow secured on transit initiation'
  });

  res.json({ success: true, message: 'Offer submitted successfully', offer });
});

// Accept offer and convert to Confirmed Transaction
app.post('/api/offers/:offerId/accept', (req, res) => {
  const { offerId } = req.params;
  const offer = db.findById('offers', offerId);
  if (!offer) return res.status(404).json({ error: 'Offer not found' });

  const finalRate = offer.buyerCounterPrice || offer.offeredPricePerQuintal;
  const grossTotal = finalRate * offer.quantity;
  const logisticsCost = 75 * offer.quantity; // ₹75/q typical Pune district transit
  const netToFpo = grossTotal - logisticsCost;

  // Update offer status
  db.updateById('offers', offerId, { status: 'CONVERTED_TO_DEAL' });

  // Update lot status
  if (offer.lotId) {
    db.updateById('lots', offer.lotId, { status: 'DEAL_CONFIRMED' });
  }

  // Create confirmed transaction
  const dealNumber = `DEAL-AGV-${Date.now().toString().slice(-4)}`;
  const txn = db.insert('transactions', {
    dealNumber,
    offerId: offer.id,
    lotId: offer.lotId,
    lotNumber: offer.lotNumber,
    fpoId: offer.fpoId,
    fpoName: offer.fpoName,
    buyerId: offer.buyerId,
    buyerName: offer.buyerName,
    commodity: `${offer.commodity} (${offer.qualityGrade})`,
    quantity: offer.quantity,
    unit: 'Quintal',
    agreedRatePerQuintal: finalRate,
    grossTotal,
    logisticsCost,
    netToFpo,
    farmerPayoutStatus: 'ESCROW_FUNDED',
    dealStatus: 'CONFIRMED',
    transporter: 'Mahalaxmi Agri Logistics (MH-14-CW-4921)',
    trackingStatus: 'Vehicle dispatched for loading at Narayangaon Hub',
    estimatedDelivery: 'Tomorrow, 11:00 AM'
  });

  res.json({
    success: true,
    message: `Deal ${dealNumber} confirmed. Escrow initiated. Proceeding to logistics dispatch.`,
    transaction: txn
  });
});

// Update transaction status (In Transit -> Delivered -> Payment Settled)
app.post('/api/transactions/:txnId/status', (req, res) => {
  const { txnId } = req.params;
  const { dealStatus, trackingStatus, farmerPayoutStatus } = req.body;

  const updated = db.updateById('transactions', txnId, {
    dealStatus: dealStatus || undefined,
    trackingStatus: trackingStatus || undefined,
    farmerPayoutStatus: farmerPayoutStatus || undefined
  });

  res.json({ success: true, transaction: updated });
});

// Get user notifications
app.get('/api/notifications/:userId', (req, res) => {
  const { userId } = req.params;
  const notifs = db.getCollection('notifications').filter(n => n.recipientId === userId || n.recipientId === 'usr_farmer_01');
  res.json(notifs);
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  AGRO VISION API SERVER RUNNING ON PORT ${PORT}`);
  console.log(`  Smart Farming. Better Markets. Better Returns.`);
  console.log(`  Workflow: Farmer → FPO → Verified Buyer`);
  console.log(`====================================================`);
});
