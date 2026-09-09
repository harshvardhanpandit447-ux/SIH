import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingCart,
  PlusCircle,
  CheckCircle2,
  Truck,
  Sparkles
} from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'matched' | 'requirements' | 'orders'>('matched');
  const [data, setData] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Create Requirement Modal
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [commodity, setCommodity] = useState('Onion');
  const [quantity, setQuantity] = useState('100');
  const [requiredGrade, setRequiredGrade] = useState('Grade A');
  const neededByDate = '2026-03-20';
  const [deliveryLocation, setDeliveryLocation] = useState('Pune Market Yard, Gultekdi');
  const [targetPrice, setTargetPrice] = useState(2800);
  const [submittingReq, setSubmittingReq] = useState(false);

  // Counter Offer Modal
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [activeLotForOffer, setActiveLotForOffer] = useState<any>(null);
  const [counterPrice, setCounterPrice] = useState(2820);

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    fetchBuyerData();
  }, []);

  const fetchBuyerData = async () => {
    try {
      const buyerId = user?.id || 'usr_buyer_01';
      const res = await fetch(`${API_BASE}/buyer/dashboard/${buyerId}`);
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error('Error fetching buyer dashboard:', err);
    }
  };

  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReq(true);
    try {
      const res = await fetch(`${API_BASE}/buyer/requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: user?.id || 'usr_buyer_01',
          buyerName: user?.name || 'Sahyadri Fresh Wholesale Pvt Ltd',
          buyerContact: user?.contactPerson || 'Rajesh Mehta',
          commodity,
          quantity: Number(quantity),
          unit: 'Quintal',
          requiredGrade,
          deliveryLocation,
          neededByDate,
          targetPricePerQuintal: Number(targetPrice)
        })
      });
      const result = await res.json();
      if (result.success) {
        setSuccessMessage('Procurement requirement published! Matching with certified FPO lots...');
        setIsReqModalOpen(false);
        fetchBuyerData();
        setActiveTab('matched');
        setTimeout(() => setSuccessMessage(null), 3500);
      }
    } catch (err) {
      console.error('Create requirement error:', err);
    } finally {
      setSubmittingReq(false);
    }
  };

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lotId: activeLotForOffer?.id || 'lot_01',
          fpoId: activeLotForOffer?.fpoId || 'usr_fpo_01',
          fpoName: activeLotForOffer?.fpoName || 'Shivneri Agri Farmers Producer Co.',
          buyerId: user?.id || 'usr_buyer_01',
          buyerName: user?.name || 'Sahyadri Fresh Wholesale Pvt Ltd',
          commodity: activeLotForOffer?.commodity || 'Onion',
          quantity: 100,
          offeredPricePerQuintal: activeLotForOffer?.expectedPricePerQuintal || 2850,
          buyerCounterPrice: Number(counterPrice)
        })
      });
      const result = await res.json();
      if (result.success) {
        setSuccessMessage(`Counter-offer of ₹${counterPrice}/q submitted to FPO for review!`);
        setIsOfferModalOpen(false);
        fetchBuyerData();
        setTimeout(() => setSuccessMessage(null), 3500);
      }
    } catch (err) {
      console.error('Send offer error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Buyer Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">
              🛒 Institutional Procurement Portal • Pune APMC Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {user?.name || 'Sahyadri Fresh Wholesale Pvt Ltd'}
            </h1>
            <p className="text-sm text-blue-200 mt-1 max-w-xl">
              Procure certified Grade A/B agricultural lots directly from verified FPOs with transparent quality inspection and guaranteed escrow settlement.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsReqModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-agro-primary hover:bg-agro-bright text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>+ Post Procurement Demand</span>
            </button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-sm font-bold mb-6 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase">Active Demands</div>
          <div className="text-2xl font-black text-agro-dark mt-1">
            {data?.requirements?.length || 2} Requirements
          </div>
          <div className="text-[11px] text-blue-600 font-bold">Onion & Tomato</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase">Matched FPO Lots</div>
          <div className="text-2xl font-black text-agro-primary mt-1">
            {data?.matchedLots?.length || 1} Available
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">Grade A Quality Certified</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase">Active Bids</div>
          <div className="text-2xl font-black text-purple-700 mt-1">
            {data?.offers?.length || 1}
          </div>
          <div className="text-[11px] text-purple-600 font-bold">₹2,820 / q Counter Active</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase">Inbound Delivery</div>
          <div className="text-2xl font-black text-emerald-800 mt-1">1 In Transit</div>
          <div className="text-[11px] text-emerald-600 font-bold">ETA Today 6:00 PM</div>
        </div>
      </div>

      {/* Tabs - Mobile Scrollable */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 mb-6 gap-2 pb-1">
        {[
          { id: 'matched', label: 'Matched FPO Lots', icon: Sparkles },
          { id: 'requirements', label: 'Demands', icon: ShoppingCart },
          { id: 'orders', label: 'Orders & Escrow', icon: Truck }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2.5 px-3.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================
          TAB 1: MATCHED FPO LOTS (Direct FPO Interaction Only)
          =================================================================== */}
      {activeTab === 'matched' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-agro-text">Available Aggregated Lots from Verified FPOs</h3>
            <span className="text-xs font-bold text-gray-500">Farmers bundle produce through certified FPOs only</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border-2 border-agro-bright/40 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>94% Match with your Demand</span>
                  </div>
                  <h4 className="text-xl font-black text-agro-text">LOT-PUN-ON-2026-01</h4>
                  <div className="text-xs text-gray-500 mt-0.5">Commodity: Red Onion (Grade A, 91% Conf.)</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-agro-dark">120 <span className="text-xs font-normal">Quintals</span></div>
                  <div className="text-xs font-bold text-agro-primary">₹2,850 / q ask</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-agro-bg border border-agro-light/80 text-xs space-y-1.5 mb-5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Offering FPO:</span>
                  <span className="font-bold text-agro-dark">Shivneri Agri Farmers Producer Co.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">FPO Trust Score:</span>
                  <span className="font-bold text-emerald-700">94 / 100 (128 Completed Trades)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dispatch Location:</span>
                  <span className="font-bold text-gray-700">Narayangaon Hub, Junnar, Pune (68 km)</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setActiveLotForOffer({
                      id: 'lot_01',
                      fpoId: 'usr_fpo_01',
                      fpoName: 'Shivneri Agri Farmers Producer Co.',
                      commodity: 'Onion',
                      expectedPricePerQuintal: 2850
                    });
                    setIsOfferModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Send Counter-Offer (₹2,820/q)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 2: MY PROCUREMENT REQUIREMENTS
          =================================================================== */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-agro-text">Your Posted Procurement Demands</h3>
            <button
              onClick={() => setIsReqModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-agro-primary text-white text-xs font-bold hover:bg-agro-dark transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Demand</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-lg font-black text-agro-text">Red Onion (Grade A)</div>
                  <div className="text-xs text-gray-500">Delivery: Pune Market Yard, Gultekdi</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                  Active Demand
                </span>
              </div>
              <div className="flex justify-between text-sm py-2 border-y border-gray-100 mb-2">
                <span className="text-gray-500">Target Volume:</span>
                <span className="font-bold text-agro-dark">100 Quintals</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Target Price Range:</span>
                <span className="font-bold text-agro-primary">₹2,800 – ₹2,900 / q</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 3: INBOUND ORDERS & DELIVERY
          =================================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-agro-text">Active Shipments & Inbound Deliveries</h3>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <span className="text-xs font-black text-blue-600 uppercase">Order #DEAL-AGV-2026-8841</span>
                <h4 className="text-xl font-bold text-agro-text mt-0.5">100 Quintals Onion (Grade A)</h4>
                <div className="text-xs text-gray-500">Supplier: Shivneri Agri Farmers Producer Co.</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-agro-dark">₹2,82,000</div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                  Escrow Funded
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center gap-4 text-xs">
              <Truck className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <div className="font-bold text-blue-900">Mahalaxmi Agro Logistics (Vehicle: MH-14-CW-4921)</div>
                <div className="text-blue-700 mt-0.5">Dispatched from Narayangaon Hub • Arriving at Gultekdi Mandi at approx. 6:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: POST PROCUREMENT REQUIREMENT
          =================================================================== */}
      {isReqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-agro-light shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-agro-text">Post Procurement Requirement</h3>
              </div>
              <button
                onClick={() => setIsReqModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequirement} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">Commodity</label>
                  <select
                    value={commodity}
                    onChange={e => setCommodity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white outline-none"
                  >
                    <option value="Onion">Onion (कांदा)</option>
                    <option value="Tomato">Tomato (टोमॅटो)</option>
                    <option value="Grapes">Grapes (द्राक्षे)</option>
                    <option value="Pomegranate">Pomegranate (डाळिंब)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">Quantity (Quintals)</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">Required Grade</label>
                  <select
                    value={requiredGrade}
                    onChange={e => setRequiredGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none"
                  >
                    <option value="Grade A">Grade A (Supermarket/Export)</option>
                    <option value="Grade B">Grade B (Standard Wholesale)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">Target Rate (₹/q)</label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={e => setTargetPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">Delivery Location / Mandi</label>
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={e => setDeliveryLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReq}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
              >
                Publish Demand for FPO Matching
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: SEND COUNTER-OFFER TO FPO
          =================================================================== */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative">
            <h3 className="text-xl font-extrabold text-agro-text mb-2">Submit Price Counter-Offer</h3>
            <p className="text-xs text-gray-500 mb-4">
              To: {activeLotForOffer?.fpoName || 'Shivneri Agri Farmers Producer Co.'}
            </p>

            <form onSubmit={handleSendOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  Your Bid / Counter Rate (₹ per Quintal)
                </label>
                <input
                  type="number"
                  required
                  value={counterPrice}
                  onChange={e => setCounterPrice(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-lg font-black text-agro-dark outline-none focus:border-blue-600"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 text-xs text-blue-900 font-medium">
                Total for 100 Quintals: <strong>₹{(counterPrice * 100).toLocaleString('en-IN')}</strong>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                >
                  Confirm & Submit Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
