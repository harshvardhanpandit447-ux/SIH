import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Package,
  Layers,
  Search,
  ArrowRightLeft,
  Truck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Plus
} from 'lucide-react';

export const FPODashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'requests' | 'lots' | 'matches' | 'offers' | 'transactions' | 'disputes'>('requests');
  const [data, setData] = useState<any>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Create Lot Modal state
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [lotCommodity, setLotCommodity] = useState('Onion');
  const [selectedProduceIds, setSelectedProduceIds] = useState<string[]>([]);
  const [expectedPrice, setExpectedPrice] = useState(2850);
  const [minPrice, setMinPrice] = useState(2750);
  const [pickupHub, setPickupHub] = useState('Narayangaon FPO Aggregation Center, Pune');

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    fetchFpoData();
  }, []);

  const fetchFpoData = async () => {
    try {
      const fpoId = user?.id || 'usr_fpo_01';
      const res = await fetch(`${API_BASE}/fpo/dashboard/${fpoId}`);
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error('Error fetching FPO dashboard:', err);
    }
  };

  const handleCreateLot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/fpo/create-lot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fpoId: user?.id || 'usr_fpo_01',
          fpoName: user?.name || 'Shivneri Agri Farmers Producer Co.',
          commodity: lotCommodity,
          selectedProduceIds,
          expectedPricePerQuintal: expectedPrice,
          minAcceptablePrice: minPrice,
          qualityGrade: 'Grade A',
          pickupHub
        })
      });
      const result = await res.json();
      if (result.success) {
        setActionSuccess(result.message);
        setIsLotModalOpen(false);
        fetchFpoData();
        setActiveTab('lots');
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Create lot error:', err);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    try {
      const res = await fetch(`${API_BASE}/offers/${offerId}/accept`, { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        setActionSuccess(`Offer accepted! Transaction ${result.transaction?.dealNumber} created. Escrow secured.`);
        fetchFpoData();
        setActiveTab('transactions');
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      console.error('Accept offer error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* FPO Hero Banner */}
      <div className="bg-gradient-to-r from-agro-dark via-emerald-900 to-agro-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              🏢 {language === 'mr' ? 'FPO एकत्रीकरण आणि व्यवहार केंद्र' : 'FPO Aggregation & Trading Desk'} • Narayangaon Hub, Pune
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {user?.name || 'Shivneri Agri Farmers Producer Co.'}
            </h1>
            <p className="text-sm text-emerald-200 mt-1 max-w-xl">
              {language === 'mr'
                ? 'शेतकऱ्यांचा शेतमाल गोळा करून प्रमाणित लॉट तयार करा आणि अधिकृत संस्थात्मक खरेदीदारांशी व्यवहार करा.'
                : 'Central Bridge: Aggregating farmer produce into commercial lots and transacting with verified institutional buyers.'}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 px-5 py-3 rounded-2xl border border-white/15">
            <div>
              <div className="text-[10px] text-emerald-300 uppercase font-bold">
                {language === 'mr' ? 'FPO विश्वासार्हता गुणांक' : 'FPO Trust Score'}
              </div>
              <div className="text-2xl font-black text-white">94 / 100</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <div className="text-[10px] text-emerald-300 uppercase font-bold">
                {language === 'mr' ? 'साठवणूक क्षमता' : 'Capacity'}
              </div>
              <div className="text-sm font-bold text-white">
                {language === 'mr' ? '५०० क्विंटल / आठवडा' : '500 Q / week'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-sm font-bold mb-6 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase">
            {language === 'mr' ? 'शेतमाल प्रस्ताव' : 'Incoming Requests'}
          </div>
          <div className="text-2xl font-black text-agro-text mt-1">
            {data?.incomingFarmerRequests?.length || 2}
          </div>
          <div className="text-[11px] text-amber-600 font-bold">
            {language === 'mr' ? 'एकत्रीकरणाची प्रतीक्षा' : 'Awaiting Aggregation'}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase">
            {language === 'mr' ? 'सक्रिय लॉट्स' : 'Active Lots'}
          </div>
          <div className="text-2xl font-black text-agro-primary mt-1">
            {data?.activeLots?.length || 2}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">
            {language === 'mr' ? 'ग्रेड A प्रमाणित' : 'Grade A Standardized'}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase">
            {language === 'mr' ? 'खरेदीदार मागणी' : 'Buyer Demands'}
          </div>
          <div className="text-2xl font-black text-blue-700 mt-1">
            {data?.openBuyerRequirements?.length || 2}
          </div>
          <div className="text-[11px] text-blue-600 font-bold">
            {language === 'mr' ? 'पुणे बाजारपेठ हब' : 'In Pune Market Hub'}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase">
            {language === 'mr' ? 'सक्रिय ऑफर्स' : 'Active Offers'}
          </div>
          <div className="text-2xl font-black text-purple-700 mt-1">
            {data?.activeOffers?.length || 1}
          </div>
          <div className="text-[11px] text-purple-600 font-bold">
            {language === 'mr' ? 'वाटाघाटी सुरू' : 'Negotiation Active'}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase">
            {language === 'mr' ? 'यशस्वी सौदे' : 'Transactions'}
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            {data?.transactions?.length || 1}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">
            {language === 'mr' ? 'एस्क्रो सुरक्षित रक्कम' : 'Escrow Funded'}
          </div>
        </div>
      </div>

      {/* Tabs - Mobile Scrollable */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 mb-6 gap-2 pb-1">
        {[
          { id: 'requests', label: language === 'mr' ? '१. शेतकरी प्रस्ताव' : '1. Farmer Requests', icon: Package },
          { id: 'lots', label: language === 'mr' ? '२. एकत्रित लॉट्स' : '2. Aggregated Lots', icon: Layers },
          { id: 'matches', label: language === 'mr' ? '३. खरेदीदार जुळवणी' : '3. Buyer Matching', icon: Search },
          { id: 'offers', label: language === 'mr' ? '४. ऑफर्स व वाटाघाटी' : '4. Offers', icon: ArrowRightLeft },
          { id: 'transactions', label: language === 'mr' ? '५. सौदे व एस्क्रो' : '5. Deals & Escrow', icon: Truck },
          { id: 'disputes', label: language === 'mr' ? '६. तक्रार निवारण' : '6. Disputes & Claims', icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2.5 px-3.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-agro-primary text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-agro-mint/60 border border-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================
          TAB 1: INCOMING FARMER REQUESTS (Ready for Lot Aggregation)
          =================================================================== */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-agro-text">
                {language === 'mr' ? 'शेतकरी शेतमाल प्रस्ताव' : 'Farmer Produce Submissions'}
              </h3>
              <p className="text-xs text-gray-500">
                {language === 'mr'
                  ? 'शेतकरी थेट आपल्या FPO कडे शेतमाल जमा करतात. गुणवत्ता तपासून व्यावसायिक लॉटमध्ये एकत्र करा.'
                  : 'Farmers submit their harvest directly to your FPO. Verify visual quality and combine into commercial lots.'}
              </p>
            </div>
            <button
              onClick={() => setIsLotModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-agro-primary text-white text-xs font-bold hover:bg-agro-dark transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'mr' ? '+ व्यावसायिक लॉट तयार करा' : '+ Bundle into Commercial Lot'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-agro-light shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-lg font-black text-agro-text">
                    {language === 'mr' ? 'सोपानराव पाटील' : 'Sopanrao Patil'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language === 'mr' ? 'ओतूर, जुन्नर • मोबाईल: ९८२२०१२३४५' : 'Otur, Junnar • Mobile: 9822012345'}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {language === 'mr' ? 'ग्रेड A (९२% अचूकता)' : 'Grade A (92% Conf.)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-agro-dark py-2 border-y border-gray-100 mb-3">
                <span>{language === 'mr' ? 'शेतमाल: कांदा (नाशिक लाल)' : 'Commodity: Onion (Nashik Red)'}</span>
                <span className="text-agro-primary">{language === 'mr' ? '५० क्विंटल' : '50 Quintals'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{language === 'mr' ? 'कापणी: २०२६-०३-०२' : 'Harvest: 2026-03-02'}</span>
                <span className="font-bold text-emerald-700">
                  {language === 'mr' ? '✓ एकत्रीकरणासाठी तयार' : '✓ Ready for Aggregation'}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-agro-light shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-lg font-black text-agro-text">
                    {language === 'mr' ? 'खंडेराव थोरात' : 'Khanderao Thorat'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language === 'mr' ? 'आळेफाटा, जुन्नर • मोबाईल: ९८२२९८७६५४' : 'Alephata, Junnar • Mobile: 9822987654'}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {language === 'mr' ? 'ग्रेड A (९०% अचूकता)' : 'Grade A (90% Conf.)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-agro-dark py-2 border-y border-gray-100 mb-3">
                <span>{language === 'mr' ? 'शेतमाल: कांदा (नाशिक लाल)' : 'Commodity: Onion (Nashik Red)'}</span>
                <span className="text-agro-primary">{language === 'mr' ? '७० क्विंटल' : '70 Quintals'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{language === 'mr' ? 'कापणी: २०२६-०३-०१' : 'Harvest: 2026-03-01'}</span>
                <span className="font-bold text-emerald-700">
                  {language === 'mr' ? '✓ एकत्रीकरणासाठी तयार' : '✓ Ready for Aggregation'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 2: AGGREGATED COMMERCIAL LOTS
          =================================================================== */}
      {activeTab === 'lots' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-lg font-black text-agro-text">
              {language === 'mr' ? 'प्रमाणित व्यावसायिक लॉट्स' : 'Standardized Commercial Lots'}
            </h3>
            <button
              onClick={() => setIsLotModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-agro-primary text-white text-xs font-bold hover:bg-agro-dark transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'mr' ? '+ नवीन लॉट तयार करा' : 'Create New Lot'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(data?.activeLots || []).map((lot: any) => (
              <div
                key={lot.id}
                className="bg-white rounded-3xl p-6 border-2 border-agro-light hover:border-agro-primary/40 shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs font-black text-agro-primary uppercase tracking-wider">
                      {lot.lotNumber}
                    </div>
                    <div className="text-2xl font-black text-agro-text mt-0.5">
                      {lot.commodity} ({lot.qualityGrade})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-agro-dark">
                      {lot.totalQuantity} <span className="text-xs font-normal">{language === 'mr' ? 'क्विंटल' : 'Quintals'}</span>
                    </div>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                      {lot.status === 'AGGREGATED' && language === 'mr' ? 'एकत्रित लॉट' : lot.status}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-agro-bg border border-agro-light text-xs space-y-1.5 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{language === 'mr' ? 'अपेक्षित पायाभूत दर:' : 'Expected Base Price:'}</span>
                    <span className="font-bold text-agro-dark">₹{lot.expectedPricePerQuintal} / q</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{language === 'mr' ? 'संकलन केंद्र:' : 'Pickup Hub:'}</span>
                    <span className="font-bold text-gray-700">{lot.pickupHub}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{language === 'mr' ? 'सहभागी शेतकरी:' : 'Participating Farmers:'}</span>
                    <span className="font-bold text-emerald-700">
                      {lot.participatingFarmerIds?.length || 2} {language === 'mr' ? 'शेतकरी एकत्रित' : 'Farmers Combined'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('matches')}
                  className="w-full py-2.5 rounded-xl bg-agro-mint text-agro-dark font-bold text-xs hover:bg-agro-primary hover:text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>
                    {language === 'mr'
                      ? `जुळणारे खरेदीदार पहा (${data?.openBuyerRequirements?.length || 2})`
                      : `View Matched Buyers (${data?.openBuyerRequirements?.length || 2})`}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 3: BUYER MATCHING ENGINE
          =================================================================== */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-black text-agro-text flex items-center gap-2">
              <Search className="w-5 h-5 text-agro-primary" />
              <span>
                {language === 'mr' ? 'अल्गोरिथमिक खरेदीदार जुळवणी इंजिन' : 'Algorithmic Buyer-Lot Matching Engine'}
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'mr'
                ? 'शेतमाल, प्रतवारी, प्रमाण, पुणे जिल्हा वाहतूक अंतर आणि किंमत नफा यांचे विश्लेषण.'
                : 'Evaluates commodity, Grade A spec, volume, Pune district transit distance, and pricing margin.'}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/40 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'mr' ? '९४% सुसंगतता जुळवणी' : '94% Compatibility Match'}</span>
                </div>
                <h4 className="text-xl font-bold text-agro-text">
                  {language === 'mr' ? 'सह्याद्री फ्रेश होलसेल प्रा. लि.' : 'Sahyadri Fresh Wholesale Pvt Ltd'}
                </h4>
                <div className="text-xs text-gray-500 mt-0.5">
                  {language === 'mr'
                    ? 'संपर्क: राजेश मेहता • पुणे मार्केट यार्ड, गुलटेकडी • ९२/१०० विश्वासार्हता'
                    : 'Contact: Rajesh Mehta • Pune Market Yard, Gultekdi • 92/100 Trust Score'}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400 font-bold uppercase">
                  {language === 'mr' ? 'खरेदीदार अपेक्षित दर' : 'Buyer Target Rate'}
                </div>
                <div className="text-2xl font-black text-agro-dark">₹2,800 – ₹2,900 / q</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 text-xs">
              <div className="p-3 rounded-xl bg-agro-bg">
                <span className="text-gray-400">{language === 'mr' ? 'मागणी:' : 'Demand:'}</span>
                <div className="font-bold text-agro-dark mt-0.5">
                  {language === 'mr' ? '१०० क्विंटल कांदा (ग्रेड A)' : '100 Quintals Onion (Grade A)'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-agro-bg">
                <span className="text-gray-400">{language === 'mr' ? 'आपला एकत्रित लॉट:' : 'Your Aggregated Lot:'}</span>
                <div className="font-bold text-agro-dark mt-0.5">LOT-PUN-ON-2026-01 (120Q Avail.)</div>
              </div>
              <div className="p-3 rounded-xl bg-agro-bg">
                <span className="text-gray-400">{language === 'mr' ? 'वाहतूक अंतर:' : 'Transit Distance:'}</span>
                <div className="font-bold text-emerald-700 mt-0.5">
                  {language === 'mr' ? '६८ किमी (नारायणगाव → गुलटेकडी)' : '68 km (Narayangaon → Gultekdi)'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="text-xs text-gray-600">
                {language === 'mr' ? (
                  <span>जुळवणी निकष: <strong>तंतोतंत शेतमाल</strong> • <strong>ग्रेड A प्रतवारी</strong> • <strong>पूर्ण प्रमाण पूर्तता</strong></span>
                ) : (
                  <span>Match Rationale: <strong>Exact Commodity</strong> • <strong>Grade A Overlap</strong> • <strong>Full Quantity Coverage</strong></span>
                )}
              </div>
              <button
                onClick={() => setActiveTab('offers')}
                className="px-5 py-2.5 rounded-xl bg-agro-primary text-white font-bold text-xs hover:bg-agro-dark transition-all flex items-center gap-1.5"
              >
                <span>{language === 'mr' ? 'बोली व प्रति-ऑफर पहा' : 'View Bidding & Counter-Offer'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 4: OFFERS & NEGOTIATION DESK
          =================================================================== */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-agro-text">
            {language === 'mr' ? 'द्विपक्षीय किंमत वाटाघाटी टेबल' : 'Bilateral Price Negotiation Desk'}
          </h3>

          <div className="bg-white rounded-3xl p-6 border border-agro-light shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase">
                  {language === 'mr' ? 'खरेदीदाराकडून प्रति-ऑफर प्राप्त' : 'Buyer Counter-Offer Received'}
                </span>
                <h4 className="text-xl font-black text-agro-text mt-2">
                  {language === 'mr' ? 'LOT-PUN-ON-2026-01 वर ऑफर (१०० क्विंटल)' : 'Offer on LOT-PUN-ON-2026-01 (100 Quintals)'}
                </h4>
                <p className="text-xs text-gray-500">
                  {language === 'mr' ? 'खरेदीदार: सह्याद्री फ्रेश होलसेल प्रा. लि.' : 'From: Sahyadri Fresh Wholesale Pvt Ltd'}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400 uppercase font-bold">
                  {language === 'mr' ? 'प्रति-दर' : 'Counter Rate'}
                </div>
                <div className="text-3xl font-black text-emerald-700">₹2,820 <span className="text-xs">/ q</span></div>
                <div className="text-[11px] text-gray-500 line-through">
                  {language === 'mr' ? 'मूळ अपेक्षित: ₹२,८५०/q' : 'Original quote: ₹2,850/q'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-agro-bg border border-agro-light/80 text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">{language === 'mr' ? 'डिलिव्हरी अटी:' : 'Delivery Terms:'}</span>
                <span className="font-bold text-agro-dark">
                  {language === 'mr'
                    ? 'FPO गोदाम डिलिव्हरी (FPO वाहतूक व्यवस्था करेल, खरेदीदार ₹७५/क्विंटल परत करेल)'
                    : 'Ex-FPO Warehouse (FPO arranges transport, buyer reimburses ₹75/q)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{language === 'mr' ? 'एकूण करार मूल्य:' : 'Total Contract Value:'}</span>
                <span className="font-bold text-agro-dark">
                  ₹2,82,000 ({language === 'mr' ? '१०० क्विंटल × ₹२,८२०' : '100 Quintals × ₹2,820'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{language === 'mr' ? 'एस्क्रो सुरक्षा अट:' : 'Escrow Condition:'}</span>
                <span className="font-bold text-emerald-800">
                  {language === 'mr' ? 'वाहतूक सुरू होताच १००% रक्कम सुरक्षित लॉक' : '100% Locked on transit dispatch'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => handleAcceptOffer('off_01')}
                className="px-6 py-3 rounded-2xl bg-agro-primary hover:bg-agro-dark text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'mr' ? 'प्रति-ऑफर स्वीकारा व सौदा पक्का करा' : 'Accept Counter-Offer & Confirm Deal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 5: TRANSACTIONS, LOGISTICS & FARMER PAYOUTS
          =================================================================== */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-agro-text">
            {language === 'mr' ? 'पक्के सौदे व वाहतूक ट्रॅकिंग' : 'Confirmed Trades & Logistics'}
          </h3>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agro-light shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <div className="text-xs font-black text-agro-primary uppercase">DEAL-AGV-2026-8841</div>
                <h4 className="text-xl font-bold text-agro-text mt-0.5">
                  {language === 'mr' ? '१०० क्विंटल कांदा (ग्रेड A)' : '100 Quintals Onion (Grade A)'}
                </h4>
                <p className="text-xs text-gray-500">
                  {language === 'mr'
                    ? 'खरेदीदार: सह्याद्री फ्रेश होलसेल • दर: ₹२,८२० / क्विंटल'
                    : 'Buyer: Sahyadri Fresh Wholesale • Rate: ₹2,820 / q'}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400 uppercase font-bold">
                  {language === 'mr' ? 'एकूण रक्कम' : 'Gross Total'}
                </div>
                <div className="text-2xl font-black text-agro-dark">₹2,82,000</div>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase">
                  {language === 'mr' ? 'मार्गावर (वाहतूक सुरू)' : 'In Transit'}
                </span>
              </div>
            </div>

            {/* Logistics Tracking Strip & Milestone Progress */}
            <div className="p-5 rounded-2xl bg-agro-bg border border-agro-light space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-agro-mint text-agro-primary flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-agro-dark">
                    Mahalaxmi Agro Logistics (MH-14-CW-4921)
                  </div>
                  <div className="text-gray-500">
                    {language === 'mr'
                      ? 'स्थिती: नारायणगाव हब येथे माल भरला • गुलटेकडी मार्केट यार्डकडे रवाना (अपेक्षित वेळ: संध्याकाळी ६:००)'
                      : 'Status: Loaded at Narayangaon Hub • In Transit to Gultekdi Mandi (ETA: 6:00 PM)'}
                  </div>
                </div>
              </div>

              {/* Milestone Step Tracker */}
              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                  ✓ 1. Dispatched
                </div>
                <div className="p-2 rounded-xl bg-blue-100 text-blue-800 font-bold animate-pulse">
                  ● 2. In Transit
                </div>
                <div className="p-2 rounded-xl bg-gray-100 text-gray-500">
                  3. Hub Arrival
                </div>
                <div className="p-2 rounded-xl bg-gray-100 text-gray-500">
                  4. Escrow Settled
                </div>
              </div>
            </div>

            {/* Farmer Payout Distribution Ledger */}
            <div>
              <h5 className="text-xs font-extrabold text-agro-text uppercase tracking-wider mb-3">
                {language === 'mr'
                  ? 'शेतकरी परतावा वितरण तपशील (थेट FPO बँक हस्तांतरण):'
                  : 'Automated Farmer Settlement Breakdown (Strict FPO Bridge):'}
              </h5>
              <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                    <tr>
                      <th className="p-3">{language === 'mr' ? 'शेतकऱ्याचे नाव' : 'Farmer Name'}</th>
                      <th className="p-3">{language === 'mr' ? 'प्रमाण' : 'Quantity'}</th>
                      <th className="p-3">{language === 'mr' ? 'निव्वळ दर' : 'Net In-Hand Rate'}</th>
                      <th className="p-3">{language === 'mr' ? 'एकूण देय' : 'Total Payable'}</th>
                      <th className="p-3">{language === 'mr' ? 'स्थिती' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    <tr>
                      <td className="p-3 font-bold text-agro-dark">
                        {language === 'mr' ? 'सोपानराव पाटील (ओतूर)' : 'Sopanrao Patil (Otur)'}
                      </td>
                      <td className="p-3">{language === 'mr' ? '५० क्विंटल' : '50 Quintals'}</td>
                      <td className="p-3 text-agro-primary font-bold">₹2,745 / q</td>
                      <td className="p-3 font-bold">₹1,37,250</td>
                      <td className="p-3">
                        <span className="text-emerald-700 font-bold">
                          {language === 'mr' ? 'एस्क्रो सुरक्षित' : 'Escrow Funded'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-agro-dark">
                        {language === 'mr' ? 'खंडेराव थोरात (आळेफाटा)' : 'Khanderao Thorat (Alephata)'}
                      </td>
                      <td className="p-3">{language === 'mr' ? '५० क्विंटल' : '50 Quintals'}</td>
                      <td className="p-3 text-agro-primary font-bold">₹2,745 / q</td>
                      <td className="p-3 font-bold">₹1,37,250</td>
                      <td className="p-3">
                        <span className="text-emerald-700 font-bold">
                          {language === 'mr' ? 'एस्क्रो सुरक्षित' : 'Escrow Funded'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 6: DISPUTES & RESOLUTION
          =================================================================== */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-agro-text">
              {language === 'mr' ? 'खरेदीदार तक्रारी व गुणवत्ता पडताळणी' : 'Buyer Claims & Quality Verification'}
            </h3>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              MSAMB Tribunal Protected
            </span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-agro-light shadow-sm space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-amber-900 uppercase">Active Dispute (Lot LOT-PUN-ON-2026-01)</span>
                  <p className="text-amber-800 mt-1">
                    Buyer raised moisture variance claim: <em>"Slight moisture variance on top layer bags (3% above Grade A spec)"</em>
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                  UNDER REVIEW
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-amber-200 text-gray-600 flex justify-between">
                <span>Claimed Amount: <strong>₹6,000</strong></span>
                <span>Arbitrator: <strong>MSAMB Market Regulator</strong></span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-agro-bg border border-agro-light text-xs text-gray-600">
              <div className="font-bold text-agro-dark mb-1">FPO Counter Evidence:</div>
              <p>
                Pre-dispatch AI grading certificate generated at Narayangaon Hub confirmed 92% Grade A compliance with dry neck integrity.
                Submitted to state tribunal for full escrow release.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: CREATE AGGREGATED LOT
          =================================================================== */}
      {isLotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-agro-light shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-agro-mint text-agro-primary">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-agro-text">
                  {language === 'mr' ? 'प्रमाणित व्यावसायिक लॉट तयार करा' : 'Create Aggregated Commercial Lot'}
                </h3>
              </div>
              <button
                onClick={() => setIsLotModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  {language === 'mr' ? 'शेतमाल' : 'Commodity'}
                </label>
                <select
                  value={lotCommodity}
                  onChange={e => setLotCommodity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white outline-none focus:border-agro-primary"
                >
                  <option value="Onion">{language === 'mr' ? '🧅 कांदा (Onion)' : '🧅 Onion (कांदा)'}</option>
                  <option value="Tomato">{language === 'mr' ? '🍅 टोमॅटो (Tomato)' : '🍅 Tomato (टोमॅटो)'}</option>
                  <option value="Grapes">{language === 'mr' ? '🍇 द्राक्षे (Grapes)' : '🍇 Grapes (द्राक्षे)'}</option>
                  <option value="Pomegranate">{language === 'mr' ? '🍎 डाळिंब (Pomegranate)' : '🍎 Pomegranate (डाळिंब)'}</option>
                  <option value="Soybean">{language === 'mr' ? '🌱 सोयाबीन (Soybean)' : '🌱 Soybean (सोयाबीन)'}</option>
                  <option value="Cabbage">{language === 'mr' ? '🥬 कोबी (Cabbage)' : '🥬 Cabbage (कोबी)'}</option>
                  <option value="Sugarcane">{language === 'mr' ? '🎋 ऊस (Sugarcane)' : '🎋 Sugarcane (ऊस)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-agro-text mb-1.5">
                  {language === 'mr'
                    ? 'एकत्र करण्यासाठी शेतमाल निवडा (एकूण: १२० क्विंटल)'
                    : 'Select Farmer Produce to Bundle (Total: 120 Quintals)'}
                </label>
                <div className="space-y-2 border border-gray-200 rounded-2xl p-3 text-xs bg-agro-bg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={e => {
                        if (e.target.checked) setSelectedProduceIds(prev => [...prev, 'prod_01']);
                        else setSelectedProduceIds(prev => prev.filter(x => x !== 'prod_01'));
                      }}
                      className="accent-agro-primary"
                    />
                    <span>
                      {language === 'mr'
                        ? 'सोपानराव पाटील • ५० क्विंटल कांदा (ग्रेड A, ओतूर)'
                        : 'Sopanrao Patil • 50 Quintals Onion (Grade A, Otur)'}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={e => {
                        if (e.target.checked) setSelectedProduceIds(prev => [...prev, 'prod_02']);
                        else setSelectedProduceIds(prev => prev.filter(x => x !== 'prod_02'));
                      }}
                      className="accent-agro-primary"
                    />
                    <span>
                      {language === 'mr'
                        ? 'खंडेराव थोरात • ७० क्विंटल कांदा (ग्रेड A, आळेफाटा)'
                        : 'Khanderao Thorat • 70 Quintals Onion (Grade A, Alephata)'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">
                    {language === 'mr' ? 'अपेक्षित दर (₹/क्विंटल)' : 'Expected Rate (₹/q)'}
                  </label>
                  <input
                    type="number"
                    value={expectedPrice}
                    onChange={e => setExpectedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">
                    {language === 'mr' ? 'किमान दर (₹/क्विंटल)' : 'Minimum Rate (₹/q)'}
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={e => setMinPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  {language === 'mr' ? 'संकलन केंद्र / गोदाम' : 'Pickup Hub / Warehouse'}
                </label>
                <input
                  type="text"
                  value={pickupHub}
                  onChange={e => setPickupHub(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-agro-primary hover:bg-agro-dark text-white font-bold text-sm shadow-md transition-all"
              >
                {language === 'mr'
                  ? 'लॉट तयार करा व खरेदीदारांसाठी प्रकाशित करा'
                  : 'Bundle & Publish Lot for Buyer Matching'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
