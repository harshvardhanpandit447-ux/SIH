/**
 * AGRO VISION - Database Store & Seed Data Service
 * Document-oriented persistent JSON store supporting Users, Profiles, Produce,
 * Lots, Requirements, Market Rates, Offers, Transactions and Notifications.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'agrovision_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data for Pune Agriculture Ecosystem
const INITIAL_DB = {
  users: [
    {
      id: 'usr_farmer_01',
      name: 'Sopanrao Patil',
      email: 'farmer@agrovision.in',
      mobile: '9822012345',
      role: 'FARMER',
      password: 'farmer123',
      village: 'Otur',
      district: 'Pune',
      state: 'Maharashtra',
      createdAt: '2026-01-15T10:00:00.000Z'
    },
    {
      id: 'usr_fpo_01',
      name: 'Shivneri Agri Farmers Producer Co.',
      contactPerson: 'Sachin Darekar (CEO)',
      email: 'fpo@agrovision.in',
      mobile: '9850123456',
      role: 'FPO',
      password: 'fpo123',
      registrationNumber: 'U01409PN2018PTC178942',
      taluka: 'Junnar',
      district: 'Pune',
      state: 'Maharashtra',
      trustScore: 94,
      aggregationCapacity: '500 Quintals/week',
      warehouseLocation: 'Narayangaon Hub, Pune-Nashik Highway',
      verified: true,
      createdAt: '2026-01-10T10:00:00.000Z'
    },
    {
      id: 'usr_buyer_01',
      name: 'Sahyadri Fresh Wholesale Pvt Ltd',
      contactPerson: 'Rajesh Mehta',
      email: 'buyer@agrovision.in',
      mobile: '9890123456',
      role: 'BUYER',
      password: 'buyer123',
      gstin: '27AABCS1429B1Z8',
      city: 'Pune',
      state: 'Maharashtra',
      buyerType: 'Institutional Wholesaler & Supermarket Supplier',
      trustScore: 92,
      createdAt: '2026-01-12T10:00:00.000Z'
    }
  ],

  fpos: [
    {
      id: 'fpo_01',
      userId: 'usr_fpo_01',
      name: 'Shivneri Agri Farmers Producer Co.',
      district: 'Pune',
      taluka: 'Junnar',
      hubLocation: 'Narayangaon, Junnar',
      products: ['Onion', 'Tomato', 'Grapes', 'Vegetables'],
      categories: ['Vegetables', 'Fruits'],
      aggregationCapacity: '500 Quintals/week',
      trustScore: 94,
      verificationStatus: 'VERIFIED_FPC',
      completedTrades: 128,
      storageFacility: '500 MT Ventilated Onion Chawl & Cold Hub'
    },
    {
      id: 'fpo_02',
      name: 'Junnar Taluka Agro Farmers FPC',
      district: 'Pune',
      taluka: 'Junnar',
      hubLocation: 'Otur, Junnar',
      products: ['Tomato', 'Pomegranate', 'Cabbage', 'Cauliflower'],
      categories: ['Vegetables', 'Fruits'],
      aggregationCapacity: '350 Quintals/week',
      trustScore: 91,
      verificationStatus: 'VERIFIED_FPC',
      completedTrades: 86,
      storageFacility: '200 MT Pre-cooling Center'
    },
    {
      id: 'fpo_03',
      name: 'Baramati Agro Vikas FPC',
      district: 'Pune',
      taluka: 'Baramati',
      hubLocation: 'Baramati MIDC',
      products: ['Grapes', 'Pomegranate', 'Sugarcane', 'Soybean'],
      categories: ['Fruits', 'Field Crops'],
      aggregationCapacity: '800 Quintals/week',
      trustScore: 96,
      verificationStatus: 'VERIFIED_FPC',
      completedTrades: 210,
      storageFacility: '1000 MT Multi-commodity Cold Storage'
    },
    {
      id: 'fpo_04',
      name: 'Khed Farmers Producer Co. Ltd.',
      district: 'Pune',
      taluka: 'Khed',
      hubLocation: 'Chakan, Khed',
      products: ['Onion', 'Potato', 'Soybean', 'Brinjal'],
      categories: ['Vegetables', 'Field Crops'],
      aggregationCapacity: '400 Quintals/week',
      trustScore: 89,
      verificationStatus: 'VERIFIED_FPC',
      completedTrades: 74,
      storageFacility: '300 MT Standard Warehouse'
    },
    {
      id: 'fpo_05',
      name: 'Indrayani Agri FPC',
      district: 'Pune',
      taluka: 'Maval',
      hubLocation: 'Talegaon Dabhade',
      products: ['Exotic Vegetables', 'Tomato', 'Okra', 'Chilli'],
      categories: ['Vegetables'],
      aggregationCapacity: '300 Quintals/week',
      trustScore: 92,
      verificationStatus: 'VERIFIED_FPC',
      completedTrades: 92,
      storageFacility: 'Temperature Controlled Hub'
    }
  ],

  // Farmer produce submissions (BEFORE aggregation)
  produces: [
    {
      id: 'prod_01',
      farmerId: 'usr_farmer_01',
      farmerName: 'Sopanrao Patil',
      farmerMobile: '9822012345',
      commodity: 'Onion',
      category: 'Vegetables',
      quantity: 50,
      unit: 'Quintal',
      harvestDate: '2026-03-02',
      location: 'Otur, Junnar, Pune',
      assignedFpoId: 'usr_fpo_01',
      assignedFpoName: 'Shivneri Agri Farmers Producer Co.',
      qualityGrade: 'Grade A',
      qualityConfidence: 92,
      aiAnalysis: {
        sizeUniformity: '94% (55-65mm)',
        surfaceBlemishes: '2.1%',
        skinCondition: 'Tunic intact, dry neck'
      },
      status: 'AGGREGATED', // SUBMITTED -> UNDER_REVIEW -> AGGREGATED -> SOLD -> PAID
      lotId: 'lot_01',
      submittedAt: '2026-03-03T09:30:00.000Z',
      estimatedNetRealisation: 2560
    },
    {
      id: 'prod_02',
      farmerId: 'usr_farmer_02',
      farmerName: 'Khanderao Thorat',
      farmerMobile: '9822987654',
      commodity: 'Onion',
      category: 'Vegetables',
      quantity: 70,
      unit: 'Quintal',
      harvestDate: '2026-03-01',
      location: 'Alephata, Junnar, Pune',
      assignedFpoId: 'usr_fpo_01',
      assignedFpoName: 'Shivneri Agri Farmers Producer Co.',
      qualityGrade: 'Grade A',
      qualityConfidence: 90,
      status: 'AGGREGATED',
      lotId: 'lot_01',
      submittedAt: '2026-03-02T11:00:00.000Z',
      estimatedNetRealisation: 2560
    }
  ],

  // FPO Aggregated Commercial Lots (Strictly FPO -> Buyer)
  lots: [
    {
      id: 'lot_01',
      lotNumber: 'LOT-PUN-ON-2026-01',
      fpoId: 'usr_fpo_01',
      fpoName: 'Shivneri Agri Farmers Producer Co.',
      fpoTrustScore: 94,
      commodity: 'Onion',
      category: 'Vegetables',
      totalQuantity: 120, // 50 from Sopanrao + 70 from Khanderao
      unit: 'Quintal',
      qualityGrade: 'Grade A',
      qualityConfidence: 91,
      expectedPricePerQuintal: 2850,
      minAcceptablePrice: 2750,
      pickupHub: 'Shivneri Hub, Narayangaon, Pune',
      location: 'Pune',
      status: 'MATCHED_OFFER_ACTIVE', // CREATED -> MATCHED_OFFER_ACTIVE -> DEAL_CONFIRMED -> IN_TRANSIT -> DELIVERED -> SETTLED
      participatingFarmerIds: ['usr_farmer_01', 'usr_farmer_02'],
      produceIds: ['prod_01', 'prod_02'],
      createdAt: '2026-03-03T14:00:00.000Z'
    },
    {
      id: 'lot_02',
      lotNumber: 'LOT-PUN-TM-2026-04',
      fpoId: 'usr_fpo_01',
      fpoName: 'Shivneri Agri Farmers Producer Co.',
      fpoTrustScore: 94,
      commodity: 'Tomato',
      category: 'Vegetables',
      totalQuantity: 85,
      unit: 'Quintal',
      qualityGrade: 'Grade A',
      qualityConfidence: 93,
      expectedPricePerQuintal: 2150,
      minAcceptablePrice: 2000,
      pickupHub: 'Shivneri Hub, Narayangaon, Pune',
      location: 'Pune',
      status: 'OPEN_FOR_MATCHING',
      participatingFarmerIds: ['usr_farmer_03'],
      produceIds: ['prod_03'],
      createdAt: '2026-03-04T10:00:00.000Z'
    }
  ],

  // Verified Buyer Requirements (Buyer -> FPO)
  requirements: [
    {
      id: 'req_01',
      buyerId: 'usr_buyer_01',
      buyerName: 'Sahyadri Fresh Wholesale Pvt Ltd',
      buyerContact: 'Rajesh Mehta',
      buyerTrustScore: 92,
      commodity: 'Onion',
      category: 'Vegetables',
      quantity: 100,
      unit: 'Quintal',
      requiredGrade: 'Grade A',
      deliveryLocation: 'Pune Market Yard, Gultekdi',
      neededByDate: '2026-03-15',
      targetPricePerQuintal: 2800,
      maxPricePerQuintal: 2900,
      status: 'OFFER_IN_PROGRESS', // ACTIVE -> OFFER_IN_PROGRESS -> FULFILLED
      createdAt: '2026-03-03T16:00:00.000Z'
    },
    {
      id: 'req_02',
      buyerId: 'usr_buyer_01',
      buyerName: 'Sahyadri Fresh Wholesale Pvt Ltd',
      buyerContact: 'Rajesh Mehta',
      buyerTrustScore: 92,
      commodity: 'Tomato',
      category: 'Vegetables',
      quantity: 80,
      unit: 'Quintal',
      requiredGrade: 'Grade A',
      deliveryLocation: 'Pune Market Yard, Gultekdi',
      neededByDate: '2026-03-12',
      targetPricePerQuintal: 2100,
      maxPricePerQuintal: 2200,
      status: 'ACTIVE',
      createdAt: '2026-03-04T09:00:00.000Z'
    }
  ],

  // Bidding / Offers between FPO and Buyer
  offers: [
    {
      id: 'off_01',
      lotId: 'lot_01',
      lotNumber: 'LOT-PUN-ON-2026-01',
      requirementId: 'req_01',
      fpoId: 'usr_fpo_01',
      fpoName: 'Shivneri Agri Farmers Producer Co.',
      buyerId: 'usr_buyer_01',
      buyerName: 'Sahyadri Fresh Wholesale Pvt Ltd',
      commodity: 'Onion',
      quantity: 100,
      unit: 'Quintal',
      qualityGrade: 'Grade A',
      offeredPricePerQuintal: 2850,
      buyerCounterPrice: 2820,
      status: 'BUYER_COUNTERED', // OFFERED -> BUYER_COUNTERED -> ACCEPTED -> REJECTED -> CONVERTED_TO_DEAL
      deliveryTerms: 'Ex-FPO Warehouse (FPO arranges transport, buyer reimburses ₹75/q)',
      paymentTerms: '100% Escrow on dispatch, release upon APMC weighment verification',
      createdAt: '2026-03-04T12:00:00.000Z',
      updatedAt: '2026-03-04T15:30:00.000Z'
    }
  ],

  // Finalized Transactions (FPO ↔ Buyer ↔ Farmer Payout)
  transactions: [
    {
      id: 'txn_01',
      dealNumber: 'DEAL-AGV-2026-8841',
      lotId: 'lot_01',
      lotNumber: 'LOT-PUN-ON-2026-01',
      fpoId: 'usr_fpo_01',
      fpoName: 'Shivneri Agri Farmers Producer Co.',
      buyerId: 'usr_buyer_01',
      buyerName: 'Sahyadri Fresh Wholesale Pvt Ltd',
      commodity: 'Onion (Grade A)',
      quantity: 100,
      unit: 'Quintal',
      agreedRatePerQuintal: 2820,
      grossTotal: 282000,
      logisticsCost: 7500, // ₹75/q
      netToFpo: 274500,
      farmerPayoutStatus: 'ESCROW_FUNDED', // ESCROW_FUNDED -> DISPATCHED -> DELIVERED -> PAID_TO_FARMERS
      dealStatus: 'IN_TRANSIT', // CONFIRMED -> IN_TRANSIT -> DELIVERED -> COMPLETED
      transporter: 'Mahalaxmi Agro Logistics (MH-14-CW-4921)',
      trackingStatus: 'Loaded at Narayangaon Hub, In Transit to Gultekdi Mandi',
      estimatedDelivery: 'Today, 6:00 PM',
      payoutBreakdown: [
        {
          farmerId: 'usr_farmer_01',
          farmerName: 'Sopanrao Patil',
          quantitySupplied: 50,
          ratePerQuintal: 2745,
          totalPayable: 137250,
          status: 'PENDING_RELEASE'
        },
        {
          farmerId: 'usr_farmer_02',
          farmerName: 'Khanderao Thorat',
          quantitySupplied: 50,
          ratePerQuintal: 2745,
          totalPayable: 137250,
          status: 'PENDING_RELEASE'
        }
      ],
      createdAt: '2026-03-05T09:00:00.000Z'
    }
  ],

  // Market Prices across Pune APMCs
  marketPrices: [
    {
      id: 'mkt_01',
      commodity: 'Onion',
      category: 'Vegetables',
      mandi: 'Pune Gultekdi',
      district: 'Pune',
      modalPrice: 2800,
      minPrice: 2100,
      maxPrice: 3200,
      unit: '₹ / Quintal',
      arrivalsQuintals: 4250,
      trend: 'INCREASING',
      lastUpdated: 'Today'
    },
    {
      id: 'mkt_02',
      commodity: 'Onion',
      category: 'Vegetables',
      mandi: 'Narayangaon',
      district: 'Pune',
      modalPrice: 2780,
      minPrice: 2000,
      maxPrice: 3150,
      unit: '₹ / Quintal',
      arrivalsQuintals: 3100,
      trend: 'INCREASING',
      lastUpdated: 'Today'
    },
    {
      id: 'mkt_03',
      commodity: 'Tomato',
      category: 'Vegetables',
      mandi: 'Narayangaon',
      district: 'Pune',
      modalPrice: 2100,
      minPrice: 1600,
      maxPrice: 2500,
      unit: '₹ / Quintal',
      arrivalsQuintals: 2800,
      trend: 'STABLE',
      lastUpdated: 'Today'
    },
    {
      id: 'mkt_04',
      commodity: 'Tomato',
      category: 'Vegetables',
      mandi: 'Pune Gultekdi',
      district: 'Pune',
      modalPrice: 2250,
      minPrice: 1700,
      maxPrice: 2650,
      unit: '₹ / Quintal',
      arrivalsQuintals: 3500,
      trend: 'INCREASING',
      lastUpdated: 'Today'
    },
    {
      id: 'mkt_05',
      commodity: 'Grapes',
      category: 'Fruits',
      mandi: 'Baramati',
      district: 'Pune',
      modalPrice: 6500,
      minPrice: 5000,
      maxPrice: 8500,
      unit: '₹ / Quintal',
      arrivalsQuintals: 1400,
      trend: 'INCREASING',
      lastUpdated: 'Today'
    },
    {
      id: 'mkt_06',
      commodity: 'Pomegranate',
      category: 'Fruits',
      mandi: 'Baramati',
      district: 'Pune',
      modalPrice: 8200,
      minPrice: 6000,
      maxPrice: 11000,
      unit: '₹ / Quintal',
      arrivalsQuintals: 950,
      trend: 'STABLE',
      lastUpdated: 'Today'
    },
    {
      id: 'mkt_07',
      commodity: 'Soybean',
      category: 'Field Crops',
      mandi: 'Khed',
      district: 'Pune',
      modalPrice: 4650,
      minPrice: 4200,
      maxPrice: 4950,
      unit: '₹ / Quintal',
      arrivalsQuintals: 1800,
      trend: 'STABLE',
      lastUpdated: 'Today'
    },
    {
      id: 'mkt_08',
      commodity: 'Sugarcane',
      category: 'Field Crops',
      mandi: 'Baramati',
      district: 'Pune',
      modalPrice: 3150,
      minPrice: 3000,
      maxPrice: 3300,
      unit: '₹ / Quintal',
      arrivalsQuintals: 5200,
      trend: 'STABLE',
      lastUpdated: 'Today'
    }
  ],

  notifications: [
    {
      id: 'notif_01',
      recipientId: 'usr_farmer_01',
      title: 'Produce Aggregated by FPO',
      message: 'Your 50 Quintals of Onion have been aggregated into Lot LOT-PUN-ON-2026-01 by Shivneri FPC.',
      type: 'PRODUCE_AGGREGATED',
      timestamp: '2026-03-03T14:15:00.000Z',
      read: false
    },
    {
      id: 'notif_02',
      recipientId: 'usr_fpo_01',
      title: 'Counter Offer Received from Buyer',
      message: 'Sahyadri Fresh Wholesale offered ₹2,820/q for 100 Quintals Onion.',
      type: 'OFFER_RECEIVED',
      timestamp: '2026-03-04T15:30:00.000Z',
      read: false
    },
    {
      id: 'notif_03',
      recipientId: 'usr_buyer_01',
      title: 'Dispatch Initiated by FPO',
      message: 'Lot LOT-PUN-ON-2026-01 is dispatched via Mahalaxmi Logistics to Pune Market Yard.',
      type: 'DISPATCH_ALERT',
      timestamp: '2026-03-05T09:15:00.000Z',
      read: false
    }
  ]
};

// Database state management
class DatabaseStore {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading database file, loading default seeds:', err);
    }
    // Write initial database file
    this.saveData(INITIAL_DB);
    return JSON.parse(JSON.stringify(INITIAL_DB));
  }

  saveData(dataToSave = this.data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  // Generic collection helpers
  getCollection(name) {
    return this.data[name] || [];
  }

  findById(name, id) {
    const coll = this.getCollection(name);
    return coll.find(item => item.id === id);
  }

  insert(name, item) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    const record = {
      id: `${name.slice(0, 4)}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ...item
    };
    this.data[name].unshift(record);
    this.saveData();
    return record;
  }

  updateById(name, id, updates) {
    const coll = this.getCollection(name);
    const index = coll.findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[name][index] = {
        ...this.data[name][index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return this.data[name][index];
    }
    return null;
  }

  deleteById(name, id) {
    if (!this.data[name]) return false;
    const initialLen = this.data[name].length;
    this.data[name] = this.data[name].filter(item => item.id !== id);
    if (this.data[name].length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  resetToSeed() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DB));
    this.saveData();
    return this.data;
  }
}

const db = new DatabaseStore();

module.exports = db;
