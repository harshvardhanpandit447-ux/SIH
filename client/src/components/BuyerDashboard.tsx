import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  tEntity,
  tMandi
} from '../utils/translationHelper';
import { API_BASE } from '../utils/apiConfig';
import {
  ShoppingCart,
  PlusCircle,
  CheckCircle2,
  Truck,
  Sparkles
} from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isMr = language === 'mr';

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

  // Dispute Filing Modal
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState(
    isMr
      ? 'वरच्या थरातील गोण्यांमध्ये ओलाव्याची तफावत (Grade A मानांकनापेक्षा ३% जादा)'
      : 'Slight moisture variance on top layer bags (3% above Grade A spec)'
  );
  const [disputeCategory, setDisputeCategory] = useState('QUALITY_MISMATCH');
  const [disputeClaimAmount, setDisputeClaimAmount] = useState(6000);
  const [filingDispute, setFilingDispute] = useState(false);

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
        setSuccessMessage(
          isMr
            ? 'खरेदी मागणी नोंदवली! प्रमाणित FPO लॉट्स सोबत जुळवणी सुरू आहे...'
            : 'Procurement requirement published! Matching with certified FPO lots...'
        );
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
        setSuccessMessage(
          isMr
            ? `₹${counterPrice}/क्विंटल दराची प्रति-ऑफर FPO कडे पुनरावलोकनासाठी पाठवली आहे!`
            : `Counter-offer of ₹${counterPrice}/q submitted to FPO for review!`
        );
        setIsOfferModalOpen(false);
        fetchBuyerData();
        setTimeout(() => setSuccessMessage(null), 3500);
      }
    } catch (err) {
      console.error('Send offer error:', err);
    }
  };

  const handleRaiseDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFilingDispute(true);
    try {
      const res = await fetch(`${API_BASE}/disputes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lotId: 'lot_01',
          lotNumber: 'LOT-PUN-ON-2026-01',
          transactionId: 'txn_01',
          raisedBy: user?.id || 'usr_buyer_01',
          raisedByName: user?.name || 'Sahyadri Fresh Wholesale Pvt Ltd',
          raisedByRole: 'BUYER',
          againstUser: 'usr_fpo_01',
          againstUserName: 'Shivneri Agri Farmers Producer Co.',
          reason: disputeReason,
          disputeCategory,
          claimedAmount: Number(disputeClaimAmount),
          evidenceUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600'
        })
      });
      const result = await res.json();
      if (result.success) {
        setSuccessMessage(
          isMr
            ? 'तक्रार अधिकृतपणे MSAMB बाजार लवाद मंडळाकडे दाखल केली. एस्क्रो वितरण स्थगित करण्यात आले.'
            : 'Dispute officially filed with MSAMB Market Regulator. Escrow disbursement paused.'
        );
        setIsDisputeModalOpen(false);
        fetchBuyerData();
        setTimeout(() => setSuccessMessage(null), 4500);
      }
    } catch (err) {
      console.error('Raise dispute error:', err);
    } finally {
      setFilingDispute(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Buyer Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">
              🛒 {isMr ? 'संस्थात्मक खरेदीदार पोर्टल • पुणे कृषी बाजार केंद्र' : 'Institutional Procurement Portal • Pune APMC Hub'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {tEntity(user?.name || 'Sahyadri Fresh Wholesale Pvt Ltd', language)}
            </h1>
            <p className="text-sm text-blue-200 mt-1 max-w-xl">
              {isMr
                ? 'अधिकृत FPO कडून थेट प्रमाणित कृषी लॉट्स खरेदी करा, पारदर्शक AI प्रतवारी तपासा आणि सुरक्षित एस्क्रो पेमेंटची खात्री मिळवा.'
                : 'Procure certified Grade A/B agricultural lots directly from verified FPOs with transparent quality inspection and guaranteed escrow settlement.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsReqModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-agro-primary hover:bg-agro-bright text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{isMr ? '+ खरेदी मागणी नोंदवा' : '+ Post Procurement Demand'}</span>
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
          <div className="text-xs font-bold text-gray-400 uppercase">
            {isMr ? 'सक्रिय खरेदी मागण्या' : 'Active Demands'}
          </div>
          <div className="text-2xl font-black text-agro-dark mt-1">
            {data?.requirements?.length || 2} {isMr ? 'मागण्या' : 'Requirements'}
          </div>
          <div className="text-[11px] text-blue-600 font-bold">
            {isMr ? 'कांदा आणि टोमॅटो' : 'Onion & Tomato'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase">
            {isMr ? 'जुळलेले FPO लॉट्स' : 'Matched FPO Lots'}
          </div>
          <div className="text-2xl font-black text-agro-primary mt-1">
            {data?.matchedLots?.length || 1} {isMr ? 'उपलब्ध' : 'Available'}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">
            {isMr ? 'A प्रत गुणवत्ता प्रमाणित' : 'Grade A Quality Certified'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase">
            {isMr ? 'सक्रिय ऑफर्स' : 'Active Bids'}
          </div>
          <div className="text-2xl font-black text-purple-700 mt-1">
            {data?.offers?.length || 1}
          </div>
          <div className="text-[11px] text-purple-600 font-bold">
            {isMr ? '₹२,८२० / क्विंटल प्रति-ऑफर सुरू' : '₹2,820 / q Counter Active'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase">
            {isMr ? 'आवक वाहतूक' : 'Inbound Delivery'}
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            {isMr ? '१ मार्गावर' : '1 In Transit'}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">
            {isMr ? 'अपेक्षित वेळ: आज संध्याकाळी ६:००' : 'ETA Today 6:00 PM'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 mb-6 gap-2 pb-1">
        {[
          { id: 'matched', label: isMr ? 'जुळलेले FPO लॉट्स' : 'Matched FPO Lots', icon: Sparkles },
          { id: 'requirements', label: isMr ? 'माझ्या खरेदी मागण्या' : 'Demands', icon: ShoppingCart },
          { id: 'orders', label: isMr ? 'सौदे व एस्क्रो' : 'Orders & Escrow', icon: Truck }
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

      {/* TAB 1: MATCHED FPO LOTS */}
      {activeTab === 'matched' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-agro-text">
              {isMr ? 'अधिकृत FPO कडून उपलब्ध प्रमाणित लॉट्स' : 'Available Aggregated Lots from Verified FPOs'}
            </h3>
            <span className="text-xs font-bold text-gray-500">
              {isMr ? 'शेतकरी केवळ FPO द्वारेच शेतमाल एकत्रित करतात' : 'Farmers bundle produce through certified FPOs only'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border-2 border-agro-bright/40 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isMr ? 'तुमच्या मागणीशी ९४% सुसंगत' : '94% Match with your Demand'}</span>
                  </div>
                  <h4 className="text-xl font-black text-agro-text">LOT-PUN-ON-2026-01</h4>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {isMr ? 'शेतमाल: लाल कांदा (A प्रत, ९१% अचूकता)' : 'Commodity: Red Onion (Grade A, 91% Conf.)'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-agro-dark">
                    120 <span className="text-xs font-normal">{isMr ? 'क्विंटल' : 'Quintals'}</span>
                  </div>
                  <div className="text-xs font-bold text-agro-primary">
                    ₹2,850 {isMr ? '/ क्विंटल अपेक्षित' : '/ q ask'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-agro-bg border border-agro-light/80 text-xs space-y-1.5 mb-5">
                <div className="flex justify-between">
                  <span className="text-gray-500">{isMr ? 'विक्रेता FPO:' : 'Offering FPO:'}</span>
                  <span className="font-bold text-agro-dark">
                    {tEntity('Shivneri Agri Farmers Producer Co.', language)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{isMr ? 'FPO विश्वासार्हता गुण:' : 'FPO Trust Score:'}</span>
                  <span className="font-bold text-emerald-700">
                    94 / 100 ({isMr ? '१२८ यशस्वी व्यवहार' : '128 Completed Trades'})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{isMr ? 'माल रवानगी ठिकाण:' : 'Dispatch Location:'}</span>
                  <span className="font-bold text-gray-700">
                    {tMandi('Narayangaon Hub, Junnar, Pune', language)} (68 km)
                  </span>
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
                  {isMr ? 'प्रति-ऑफर पाठवा (₹२,८२०/क्विंटल)' : 'Send Counter-Offer (₹2,820/q)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY PROCUREMENT REQUIREMENTS */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-agro-text">
              {isMr ? 'तुमच्या नोंदवलेल्या खरेदी मागण्या' : 'Your Posted Procurement Demands'}
            </h3>
            <button
              onClick={() => setIsReqModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-agro-primary text-white text-xs font-bold hover:bg-agro-dark transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isMr ? '+ नवीन मागणी नोंदवा' : 'Post New Demand'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-lg font-black text-agro-text">
                    {isMr ? 'लाल कांदा (A प्रत)' : 'Red Onion (Grade A)'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isMr ? 'वितरण: पुणे मार्केट यार्ड, गुलटेकडी' : 'Delivery: Pune Market Yard, Gultekdi'}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                  {isMr ? 'सक्रिय मागणी' : 'Active Demand'}
                </span>
              </div>
              <div className="flex justify-between text-sm py-2 border-y border-gray-100 mb-2">
                <span className="text-gray-500">{isMr ? 'अपेक्षित प्रमाण:' : 'Target Volume:'}</span>
                <span className="font-bold text-agro-dark">100 {isMr ? 'क्विंटल' : 'Quintals'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">{isMr ? 'अपेक्षित खरेदी भाव:' : 'Target Price Range:'}</span>
                <span className="font-bold text-agro-primary">₹2,800 – ₹2,900 {isMr ? '/ क्विंटल' : '/ q'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INBOUND ORDERS & DELIVERY */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-agro-text">
            {isMr ? 'सक्रिय वाहतूक आणि येणारे लॉट्स' : 'Active Shipments & Inbound Deliveries'}
          </h3>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-black text-blue-600 uppercase">
                  {isMr ? 'सौदा #DEAL-AGV-2026-8841' : 'Order #DEAL-AGV-2026-8841'}
                </span>
                <h4 className="text-xl font-bold text-agro-text mt-0.5">
                  100 {isMr ? 'क्विंटल कांदा (A प्रत)' : 'Quintals Onion (Grade A)'}
                </h4>
                <div className="text-xs text-gray-500">
                  {isMr ? 'पुरवठादार:' : 'Supplier:'}{' '}
                  {tEntity('Shivneri Agri Farmers Producer Co.', language)}{' '}
                  ({isMr ? 'सुवर्ण श्रेणी FPC' : 'Gold Tier'})
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-agro-dark">₹2,82,000</div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                  {isMr ? 'एस्क्रो सुरक्षित रक्कम' : 'Escrow Funded'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center gap-4 text-xs">
              <Truck className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <div className="font-bold text-blue-900">
                  {isMr ? 'महालक्ष्मी ॲग्रो लॉजिस्टिक्स (वाहन: MH-14-CW-4921)' : 'Mahalaxmi Agro Logistics (Vehicle: MH-14-CW-4921)'}
                </div>
                <div className="text-blue-700 mt-0.5">
                  {isMr
                    ? 'नारायणगाव केंद्रातून रवाना • गुलटेकडी मार्केट यार्डात अंदाजे संध्याकाळी ६:०० वाजता पोहोचेल'
                    : 'Dispatched from Narayangaon Hub • Arriving at Gultekdi Mandi at approx. 6:00 PM'}
                </div>
              </div>
            </div>

            {/* Delivery Actions */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-agro-dark">
                  {isMr ? 'गुणवत्ता तपासणी व पोच पावती:' : 'Quality Inspection Sign-Off:'}
                </span>
                <p className="text-gray-500">
                  {isMr
                    ? 'वाहन पोहोचल्यावर डिजिटल AI प्रमाणपत्राशी माल तपासून अंतिम एस्क्रो पेमेंट मुक्त करा.'
                    : 'Upon vehicle arrival, verify lot grading against the digital AI certificate before final payout.'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsDisputeModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold transition-all"
                >
                  {isMr ? '⚠️ तक्रार दाखल करा' : '⚠️ Raise Dispute'}
                </button>
                <button
                  onClick={() => {
                    setSuccessMessage(
                      isMr
                        ? 'मालाची पडताळणी पूर्ण! एस्क्रो रक्कम शिवनेरी FPC आणि संबंधित शेतकऱ्यांना जमा झाली.'
                        : 'Delivery verified! Escrow payout released to Shivneri FPC and participating farmers.'
                    );
                    setTimeout(() => setSuccessMessage(null), 4000);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isMr ? 'स्वीकारा व एस्क्रो मुक्त करा' : 'Accept & Release Escrow'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: POST PROCUREMENT REQUIREMENT */}
      {isReqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-agro-light shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-agro-text">
                  {isMr ? 'नवीन खरेदी मागणी नोंदवा' : 'Post Procurement Requirement'}
                </h3>
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
                  <label className="block text-xs font-bold text-agro-text mb-1">
                    {isMr ? 'शेतमाल / पीक' : 'Commodity'}
                  </label>
                  <select
                    value={commodity}
                    onChange={e => setCommodity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white outline-none"
                  >
                    <option value="Onion">{isMr ? 'कांदा (Onion)' : 'Onion (कांदा)'}</option>
                    <option value="Tomato">{isMr ? 'टोमॅटो (Tomato)' : 'Tomato (टोमॅटो)'}</option>
                    <option value="Grapes">{isMr ? 'द्राक्षे (Grapes)' : 'Grapes (द्राक्षे)'}</option>
                    <option value="Pomegranate">{isMr ? 'डाळिंब (Pomegranate)' : 'Pomegranate (डाळिंब)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">
                    {isMr ? 'प्रमाण (क्विंटल)' : 'Quantity (Quintals)'}
                  </label>
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
                  <label className="block text-xs font-bold text-agro-text mb-1">
                    {isMr ? 'अपेक्षित प्रत (Grade)' : 'Required Grade'}
                  </label>
                  <select
                    value={requiredGrade}
                    onChange={e => setRequiredGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none"
                  >
                    <option value="Grade A">
                      {isMr ? 'A प्रत (सुपरमार्केट/निर्यात दर्जा)' : 'Grade A (Supermarket/Export)'}
                    </option>
                    <option value="Grade B">
                      {isMr ? 'B प्रत (मानक घाऊक बाजार)' : 'Grade B (Standard Wholesale)'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">
                    {isMr ? 'अपेक्षित दर (₹/क्विंटल)' : 'Target Rate (₹/q)'}
                  </label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={e => setTargetPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  {isMr ? 'वितरण ठिकाण / गोडाऊन' : 'Delivery Location / Mandi'}
                </label>
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
                {isMr ? 'FPO मॅचिंगसाठी मागणी प्रसिद्ध करा' : 'Publish Demand for FPO Matching'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SEND COUNTER-OFFER TO FPO */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative">
            <h3 className="text-xl font-extrabold text-agro-text mb-2">
              {isMr ? 'दराची प्रति-ऑफर दाखल करा' : 'Submit Price Counter-Offer'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {isMr ? 'FPO संस्था:' : 'To:'}{' '}
              <strong>{tEntity(activeLotForOffer?.fpoName || 'Shivneri Agri Farmers Producer Co.', language)}</strong>
            </p>

            <form onSubmit={handleSendOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  {isMr ? 'तुमचा प्रस्तावित दर (₹ प्रति क्विंटल)' : 'Your Bid / Counter Rate (₹ per Quintal)'}
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
                {isMr ? '१०० क्विंटलसाठी एकूण रक्कम:' : 'Total for 100 Quintals:'}{' '}
                <strong>₹{(counterPrice * 100).toLocaleString('en-IN')}</strong>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                >
                  {isMr ? 'ऑफर पाठवा' : 'Confirm & Submit Bid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RAISE QUALITY / DELIVERY DISPUTE */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-100 text-rose-700 text-lg">⚠️</span>
                <h3 className="text-xl font-extrabold text-agro-text">
                  {isMr ? 'तक्रार व नुकसानभरपाई दावा' : 'File Trade Variance Claim'}
                </h3>
              </div>
              <button
                onClick={() => setIsDisputeModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              {isMr ? 'सौदा क्रमांक:' : 'Order:'}{' '}
              <strong>#DEAL-AGV-2026-8841 ({tEntity('Shivneri Agri Farmers Producer Co.', language)})</strong> •{' '}
              {isMr
                ? 'स्वतंत्र लवादासाठी महाराष्ट्र राज्य कृषी पणन मंडळाकडे (MSAMB) वर्ग.'
                : 'Escalated to MSAMB State Market Tribunal for independent arbitration.'}
            </p>

            <form onSubmit={handleRaiseDisputeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  {isMr ? 'तक्रार प्रकार' : 'Dispute Category'}
                </label>
                <select
                  value={disputeCategory}
                  onChange={e => setDisputeCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm font-bold bg-white outline-none"
                >
                  <option value="QUALITY_MISMATCH">
                    {isMr ? 'गुणवत्ता / ओलाव्यातील तफावत (A मानांकनापेक्षा ३% जादा)' : 'Quality / Moisture Variance (3%+ above Grade A)'}
                  </option>
                  <option value="WEIGHT_SHORTAGE">
                    {isMr ? 'काट्यावरील वजनात तूट (> २% पेक्षा जास्त)' : 'Mandi Scale Weight Shortage (> 2% tolerance)'}
                  </option>
                  <option value="DAMAGED_IN_TRANSIT">
                    {isMr ? 'वाहतुकीतील शेतमालाचे नुकसान व डाग' : 'Physical Transit Bruising / Sunscald Damage'}
                  </option>
                  <option value="DELIVERY_DELAY">
                    {isMr ? 'वाहतुकीस तीव्र विलंब (२४ तासांहून अधिक)' : 'Severe Logistics Delay (> 24h ETA breach)'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  {isMr ? 'दावा केलेली परतावा / नुकसान रक्कम (₹)' : 'Claimed Compensation / Variance Amount (₹)'}
                </label>
                <input
                  type="number"
                  required
                  min="500"
                  max="50000"
                  value={disputeClaimAmount}
                  onChange={e => setDisputeClaimAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-base font-black text-rose-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  {isMr ? 'तपासणीतील निष्कर्ष व सविस्तर कारण' : 'Inspection Findings & Specific Reason'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={disputeReason}
                  onChange={e => setDisputeReason(e.target.value)}
                  placeholder={isMr ? 'मंडईमध्ये गाडी उतरवताना आढळलेल्या त्रुटी येथे नोंदवा...' : 'Describe defects observed upon unloading at APMC...'}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-700 outline-none focus:border-rose-500"
                />
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-[11px] text-rose-800">
                {isMr
                  ? `एस्क्रो संरक्षण सक्रिय आहे. दावा दाखल केल्यावर ₹${disputeClaimAmount} ची रक्कम MSAMB लवाद निर्णयापर्यंत सुरक्षित ठेवली जाईल.`
                  : `Escrow protection is active. Upon submission, the contested ₹${disputeClaimAmount} will remain locked in escrow until MSAMB tribunal review.`}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDisputeModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={filingDispute}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  {filingDispute ? (isMr ? 'दाखल होत आहे...' : 'Filing...') : (isMr ? 'लवाद मंडळाकडे दावा पाठवा' : 'Submit Claim to Tribunal')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
