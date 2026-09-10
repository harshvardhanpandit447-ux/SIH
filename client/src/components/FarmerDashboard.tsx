import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  PlusCircle,
  TrendingUp,
  Sparkles,
  Building2,
  Package,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Camera,
  RefreshCw,
  Warehouse,
  Coins,
  Scale,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Award
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'produce' | 'market' | 'rankings' | 'quality' | 'fpo'>('produce');
  const [produces, setProduces] = useState<any[]>([]);
  const [fpos, setFpos] = useState<any[]>([]);

  // Add Produce Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [commodity, setCommodity] = useState('Onion');
  const [category, setCategory] = useState('Vegetables');
  const [quantity, setQuantity] = useState('50');
  const [harvestDate, setHarvestDate] = useState('2026-03-05');
  const [location, setLocation] = useState('Otur, Junnar, Pune');
  const [assignedFpoId, setAssignedFpoId] = useState('usr_fpo_01');
  const estimatedPrice = 2800;
  const [submitting, setSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  // ML Price Prediction State
  const [mlCommodity, setMlCommodity] = useState('onion');
  const [mlHorizon, setMlHorizon] = useState(3);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [predicting, setPredicting] = useState(false);

  // AI Quality Inspection State
  const [inspectCommodity, setInspectCommodity] = useState('onion');
  const [qualityResult, setQualityResult] = useState<any>(null);
  const [inspecting, setInspecting] = useState(false);

  // Multi-Mandi Ranking & Net Realisation State
  const [rankingCrop, setRankingCrop] = useState('Onion');
  const [rankingQty, setRankingQty] = useState(50);
  const [rankingStorageDays, setRankingStorageDays] = useState(0);
  const [rankingData, setRankingData] = useState<any>(null);
  const [rankingLoading, setRankingLoading] = useState(false);

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    fetchFarmerData();
    fetchPrediction('onion', 3);
    runAiQualityTest('onion');
    fetchRankings('Onion', 50, 0);
  }, []);

  const fetchRankings = async (crop: string, qty: number, days: number) => {
    setRankingLoading(true);
    try {
      const res = await fetch(`${API_BASE}/market/rankings?crop=${crop}&quantity=${qty}&storageDays=${days}`);
      const data = await res.json();
      if (data.success) {
        setRankingData(data);
      }
    } catch (err) {
      console.error('Error fetching market rankings:', err);
    } finally {
      setRankingLoading(false);
    }
  };

  const fetchFarmerData = async () => {
    try {
      const farmerId = user?.id || 'usr_farmer_01';
      const [resProd, resFpos] = await Promise.all([
        fetch(`${API_BASE}/farmer/produce/${farmerId}`),
        fetch(`${API_BASE}/fpos/list`)
      ]);
      const dataProd = await resProd.json();
      const dataFpos = await resFpos.json();
      setProduces(Array.isArray(dataProd) ? dataProd : []);
      setFpos(Array.isArray(dataFpos) ? dataFpos : []);
    } catch (err) {
      console.error('Error fetching farmer dashboard data:', err);
    }
  };

  const fetchPrediction = async (crop: string, weeks: number) => {
    setPredicting(true);
    try {
      const res = await fetch(`${API_BASE}/ml/predict-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commodity: crop, mandi: 'Pune Gultekdi', horizonWeeks: weeks })
      });
      const data = await res.json();
      setPredictionData(data);
    } catch (err) {
      console.error('Prediction API error:', err);
    } finally {
      setPredicting(false);
    }
  };

  const runAiQualityTest = async (crop: string) => {
    setInspecting(true);
    try {
      const res = await fetch(`${API_BASE}/ml/assess-quality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commodity: crop })
      });
      const data = await res.json();
      setQualityResult(data);
    } catch (err) {
      console.error('AI Quality test error:', err);
    } finally {
      setInspecting(false);
    }
  };

  const handleAddProduceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalSuccess(null);

    const fpoName = fpos.find(f => f.userId === assignedFpoId || f.id === assignedFpoId)?.name || 'Shivneri Agri Farmers Producer Co.';

    try {
      const res = await fetch(`${API_BASE}/farmer/produce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: user?.id || 'usr_farmer_01',
          farmerName: user?.name || 'Sopanrao Patil',
          farmerMobile: user?.mobile || '9822012345',
          commodity,
          category,
          quantity: Number(quantity),
          unit: 'Quintal',
          harvestDate,
          location,
          assignedFpoId,
          assignedFpoName: fpoName,
          qualityGrade: qualityResult?.grade || 'Grade A',
          qualityConfidence: qualityResult?.confidence || 92,
          estimatedPrice
        })
      });
      const result = await res.json();
      if (result.success) {
        setModalSuccess('Produce submitted to FPO for aggregation & quality verification!');
        fetchFarmerData();
        setTimeout(() => {
          setIsAddModalOpen(false);
          setModalSuccess(null);
        }, 1200);
      }
    } catch (err) {
      console.error('Submit produce error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-agro-dark to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold mb-2">
              🌾 {language === 'mr' ? 'शेतकरी पोर्टल' : 'Farmer Portal'} • {user?.village || 'Otur'}, Pune
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {language === 'mr' ? 'स्वागत आहे,' : 'Welcome back,'} {user?.name || 'Sopanrao Patil'}
            </h1>
            <p className="text-sm text-emerald-200 mt-1 max-w-xl">
              {language === 'mr'
                ? 'तुमचा शेतमाल FPO द्वारे एकत्रित केला जातो. खरेदीदारांशी थेट संपर्क न करता FPO द्वारे जास्तीत जास्त निव्वळ परतावा मिळवा.'
                : 'Your produce is aggregated into certified lots through your FPO for high-value institutional sale.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-agro-primary hover:bg-agro-bright text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{language === 'mr' ? '+ शेतमाल जोडा' : '+ Add Produce'}</span>
            </button>
            <button
              onClick={() => setActiveTab('market')}
              className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/20 text-white font-bold text-sm transition-colors flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{language === 'mr' ? 'बाजार अंदाज' : 'ML Forecast'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-5 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {language === 'mr' ? 'सध्याचा बाजारभाव (कांदा)' : 'Current Mandi Rate (Onion)'}
          </div>
          <div className="text-2xl font-black text-agro-dark">
            ₹2,800 <span className="text-xs font-semibold text-gray-400">/ q</span>
          </div>
          <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <span>▲ +5.6% Pune Gultekdi</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {language === 'mr' ? 'ML अंदाजित भाव कक्षा' : 'ML Predicted Range'}
          </div>
          <div className="text-2xl font-black text-agro-primary">
            ₹3,050 – ₹3,180
          </div>
          <div className="text-xs text-blue-600 font-bold mt-1">
            85% Confidence (3-Weeks)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {language === 'mr' ? 'अपेक्षित निव्वळ प्राप्ती' : 'Est. Net Realisation'}
          </div>
          <div className="text-2xl font-black text-emerald-800">
            ₹2,560 <span className="text-xs font-semibold text-gray-400">/ q</span>
          </div>
          <div className="text-xs text-gray-500 font-medium mt-1">
            After FPO transport & handling
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {language === 'mr' ? 'माझी FPO संस्था' : 'Assigned FPO'}
          </div>
          <div className="text-lg font-bold text-agro-dark truncate">
            Shivneri Agri FPC
          </div>
          <div className="text-xs text-emerald-700 font-bold mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>94/100 Trust Score</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Mobile Scrollable */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 mb-6 gap-2 pb-1">
        {[
          { id: 'produce', label: language === 'mr' ? 'माझा शेतमाल' : 'My Produce & Lots', icon: Package },
          { id: 'market', label: language === 'mr' ? 'ML दर अंदाज' : 'ML Price Prediction', icon: TrendingUp },
          { id: 'rankings', label: language === 'mr' ? 'बाजारपेठ रँकिंग (Net Realisation)' : 'Mandi Rankings (Net ₹)', icon: Scale },
          { id: 'quality', label: language === 'mr' ? 'AI प्रतवारी' : 'AI Quality Scan', icon: Sparkles },
          { id: 'fpo', label: language === 'mr' ? 'FPO माहिती' : 'FPO Aggregation', icon: Building2 }
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
          TAB 1: MY PRODUCE & AGGREGATION STATUS
          =================================================================== */}
      {activeTab === 'produce' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-agro-text">
              {language === 'mr' ? 'दाखल केलेला शेतमाल' : 'Submitted Produce Submissions'}
            </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-bold text-agro-primary hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'mr' ? 'नवीन शेतमाल जोडा' : 'Add New Produce'}</span>
            </button>
          </div>

          {produces.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-agro-light p-6">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <div className="font-bold text-gray-600">No produce submitted yet</div>
              <p className="text-xs text-gray-400 mt-1 mb-4">
                Click Add Produce to submit your harvest to your local FPO for aggregation.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-agro-primary text-white text-xs font-bold"
              >
                + Add Onion or Tomato
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {produces.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-white rounded-3xl p-6 border border-agro-light shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-agro-text">{item.commodity}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            {item.qualityGrade || 'Grade A'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.category} • Harvest: {item.harvestDate}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-agro-dark">
                          {item.quantity} <span className="text-xs font-normal">{item.unit || 'Quintal'}</span>
                        </div>
                        <span className="inline-block mt-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900">
                          {item.status || 'SUBMITTED'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-agro-bg border border-agro-light/80 space-y-1.5 text-xs text-agro-text/80 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Assigned FPO:</span>
                        <span className="font-bold text-agro-dark">{item.assignedFpoName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Aggregation Lot:</span>
                        <span className="font-bold text-emerald-700">{item.aggregatedLotNumber || item.lotId || 'Lot Bundling in Progress'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Est. Net Realisation:</span>
                        <span className="font-bold text-agro-primary">₹{item.estimatedNetRealisation || 2560} / q</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Status Progression */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-[11px] font-bold text-gray-500 mb-2">Workflow Progression:</div>
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-emerald-700">1. Submitted ✓</span>
                      <span className="text-emerald-700">2. FPO Verified ✓</span>
                      <span className={item.status === 'AGGREGATED' ? 'text-emerald-700 font-extrabold' : 'text-gray-400'}>
                        3. Lot Aggregated
                      </span>
                      <span className="text-gray-400">4. Payout</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          TAB 2: ML FUTURE PRICE PREDICTION & CROP INTELLIGENCE
          =================================================================== */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agro-light shadow-sm">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-agro-text flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-agro-primary" />
                  <span>{language === 'mr' ? 'पीकनिहाय ML बाजारभाव अंदाज व साठवणूक विश्लेषण' : 'Crop-Calibrated ML Price Prediction & Storage Intelligence'}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'mr'
                    ? 'हवामान, आवक, जैविक घट (Shrinkage) आणि शीतगृह/चाळ साठवणूक खर्चावर आधारित प्रगत विश्लेषण.'
                    : 'Time-series regression calibrated with biological decay, storage economics, and APMC arbitrage.'}
                </p>
              </div>

              {/* Horizon Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">{language === 'mr' ? 'कालावधी:' : 'Horizon:'}</span>
                <div className="flex rounded-xl bg-agro-bg p-1 border border-gray-200">
                  {[1, 2, 3, 4, 6].map(h => (
                    <button
                      key={h}
                      onClick={() => {
                        setMlHorizon(h);
                        fetchPrediction(mlCommodity, h);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        mlHorizon === h
                          ? 'bg-agro-primary text-white shadow-sm'
                          : 'text-gray-600 hover:text-agro-dark'
                      }`}
                    >
                      {h} {language === 'mr' ? 'आठवडे' : (h === 1 ? 'Wk' : 'Wks')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Crop Selector Pills */}
            <div className="mb-6">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {language === 'mr' ? 'पीक निवडा (Select Crop):' : 'Select Crop Category:'}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {[
                  { key: 'onion', nameEn: 'Onion', nameMr: 'कांदा', icon: '🧅' },
                  { key: 'tomato', nameEn: 'Tomato', nameMr: 'टोमॅटो', icon: '🍅' },
                  { key: 'grapes', nameEn: 'Grapes', nameMr: 'द्राक्षे', icon: '🍇' },
                  { key: 'pomegranate', nameEn: 'Pomegranate', nameMr: 'डाळिंब', icon: '🍎' },
                  { key: 'soybean', nameEn: 'Soybean', nameMr: 'सोयाबीन', icon: '🌱' },
                  { key: 'cabbage', nameEn: 'Cabbage', nameMr: 'कोबी', icon: '🥬' },
                  { key: 'sugarcane', nameEn: 'Sugarcane', nameMr: 'ऊस', icon: '🎋' }
                ].map(c => {
                  const isSelected = mlCommodity.toLowerCase() === c.key;
                  return (
                    <button
                      key={c.key}
                      onClick={() => {
                        setMlCommodity(c.key);
                        fetchPrediction(c.key, mlHorizon);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-50 border-agro-primary shadow-sm ring-2 ring-agro-primary/20'
                          : 'bg-white border-gray-200 hover:border-agro-light hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-2xl">{c.icon}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-agro-primary" />
                        )}
                      </div>
                      <div className="text-xs font-black text-agro-dark">
                        {language === 'mr' ? c.nameMr : c.nameEn}
                      </div>
                      <div className="text-[10px] text-gray-500 font-medium">
                        {language === 'mr' ? c.nameEn : c.nameMr}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {predicting ? (
              <div className="py-16 text-center text-sm font-bold text-gray-500">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-agro-primary mb-3" />
                <span>{language === 'mr' ? 'पीक-विशिष्ट ML अल्गोरिदम चालवत आहे...' : 'Running Crop-Specific Time-Series Regressor...'}</span>
              </div>
            ) : predictionData ? (
              <div className="space-y-6">
                {/* 1. Crop Biological & Agronomic Specs Banner */}
                {predictionData.cropAttributes && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-agro-dark text-white shadow-sm flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{predictionData.icon || '🌾'}</span>
                      <div>
                        <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                          {predictionData.cropAttributes.type} • {predictionData.category}
                        </div>
                        <h3 className="text-lg font-black">{predictionData.commodity}</h3>
                        <p className="text-xs text-white/80">
                          {language === 'mr' ? 'प्रमुख वाण: ' : 'Key Varieties: '}
                          <span className="font-semibold text-emerald-200">{predictionData.cropAttributes.primaryVarieties}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                        <div className="text-[10px] text-emerald-300 uppercase font-bold flex items-center gap-1">
                          <Warehouse className="w-3 h-3" />
                          <span>{language === 'mr' ? 'साठवणूक पद्धत' : 'Storage Method'}</span>
                        </div>
                        <div className="font-bold">{predictionData.cropAttributes.storageType}</div>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                        <div className="text-[10px] text-emerald-300 uppercase font-bold">{language === 'mr' ? 'टिकाऊपणा' : 'Safe Window'}</div>
                        <div className="font-bold">{predictionData.cropAttributes.safeStorageDuration}</div>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                        <div className="text-[10px] text-emerald-300 uppercase font-bold flex items-center gap-1">
                          <Scale className="w-3 h-3" />
                          <span>{language === 'mr' ? 'घट / नुकसान' : 'Shrinkage Rate'}</span>
                        </div>
                        <div className="font-bold">{predictionData.cropAttributes.monthlyShrinkageRate}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Top Forecast & Economic Advisory Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Predicted Range Card */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-agro-bright/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        <span>{language === 'mr' ? 'अपेक्षित बाजारभाव' : 'Predicted Price Range'}</span>
                        <span className="text-agro-primary font-black flex items-center gap-0.5">
                          {predictionData.trendDirection === 'INCREASING' ? (
                            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-rose-600" />
                          )}
                          +{predictionData.growthPercentage}%
                        </span>
                      </div>
                      <div className="text-3xl sm:text-4xl font-black text-agro-dark my-2 tracking-tight">
                        {predictionData.predictedDisplay}
                      </div>
                      <p className="text-xs text-gray-500">
                        {language === 'mr' ? 'सध्याचा स्पॉट दर: ' : 'Current Spot Rate: '}
                        <span className="font-bold text-agro-dark">₹{predictionData.currentPrice?.toLocaleString('en-IN')} / q</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-emerald-200/70 text-xs flex items-center justify-between">
                      <span className="text-gray-600 font-medium">{language === 'mr' ? 'मॉडेल अचूकता स्कोर:' : 'Model Confidence Score:'}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-black">
                        {predictionData.confidenceScore}%
                      </span>
                    </div>
                  </div>

                  {/* Sell Now vs Wait vs Store Card */}
                  <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 lg:col-span-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-xl text-white font-black text-xs uppercase tracking-wide ${
                            predictionData.recommendation === 'STORE'
                              ? 'bg-emerald-600'
                              : predictionData.recommendation === 'WAIT'
                              ? 'bg-amber-600'
                              : 'bg-rose-600'
                          }`}>
                            {predictionData.recommendation}
                          </span>
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5 text-amber-700" />
                            {language === 'mr' ? 'कृषी अर्थतज्ज्ञ AI सल्ला' : 'Agri-Economic AI Advisory'}
                          </span>
                        </div>
                        <span className="text-[11px] font-extrabold text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                          {predictionData.recommendationVerdict}
                        </span>
                      </div>

                      <p className="text-sm text-amber-950 leading-relaxed font-medium">
                        {language === 'mr'
                          ? predictionData.recommendationText?.mr
                          : predictionData.recommendationText?.en}
                      </p>
                    </div>

                    {/* Economics summary */}
                    <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-amber-200 text-xs">
                      <div>
                        <span className="text-gray-500">{language === 'mr' ? 'अपेक्षित वाढ' : 'Gross Appreciation'}:</span>
                        <div className="font-black text-agro-dark">
                          +₹{predictionData.storageEconomics?.grossGain ?? predictionData.netGainEstimate} / q
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">{language === 'mr' ? 'साठवणूक + घट खर्च' : 'Holding + Spoilage'}:</span>
                        <div className="font-black text-rose-700">
                          -₹{predictionData.storageEconomics?.totalHoldingCost ?? predictionData.holdingCostEstimate} / q
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">{language === 'mr' ? 'निव्वळ फायदा' : 'True Net Realization'}:</span>
                        <div className={`font-black text-sm ${
                          (predictionData.storageEconomics?.netGain ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {(predictionData.storageEconomics?.netGain ?? 0) >= 0 ? '+' : ''}
                          ₹{predictionData.storageEconomics?.netGain ?? predictionData.netGainEstimate} / q
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Crop-Specific Market Drivers */}
                {predictionData.cropSpecificDrivers && predictionData.cropSpecificDrivers.length > 0 && (
                  <div className="bg-agro-bg rounded-3xl p-6 border border-agro-light/80">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-amber-600" />
                      <h4 className="text-sm font-black text-agro-text uppercase tracking-wide">
                        {language === 'mr'
                          ? `${predictionData.commodity} साठी प्रमुख बाजार घटक (Market Drivers)`
                          : `Real-Time Market Drivers for ${predictionData.shortName || predictionData.commodity}`}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {predictionData.cropSpecificDrivers.map((driver: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                driver.impact === 'POSITIVE'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {driver.impact}
                              </span>
                              <span className="text-xs font-black text-agro-dark">{driver.weight}</span>
                            </div>
                            <h5 className="font-bold text-xs text-agro-text mb-1">{driver.factor}</h5>
                            <p className="text-[11px] text-gray-600 leading-normal">
                              {language === 'mr' ? driver.descriptionMr : driver.descriptionEn}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Regional Mandi Arbitrage Matrix */}
                {predictionData.mandiComparison && predictionData.mandiComparison.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-agro-primary" />
                        <h4 className="text-sm font-black text-agro-text">
                          {language === 'mr' ? 'पुणे जिल्ह्यातील प्रमुख बाजारपेठा दर तुलना (Mandi Arbitrage)' : 'Regional Mandi Realization Comparison'}
                        </h4>
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {language === 'mr' ? 'वाहतूक खर्च वजा करून निव्वळ परतावा' : 'Net in-hand price after transport deductions'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {predictionData.mandiComparison.map((m: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border transition-all ${
                            m.isBestOption
                              ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-400'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-black text-agro-dark">{m.mandi}</span>
                            {m.isBestOption && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                                <Award className="w-3 h-3" />
                                {language === 'mr' ? 'सर्वोत्तम परतावा' : 'Top Realization'}
                              </span>
                            )}
                          </div>
                          <div className="text-lg font-black text-agro-dark">
                            ₹{m.netRealisation?.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-gray-500">/ q (Net)</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-1 flex justify-between">
                            <span>Mandi Price: ₹{m.estimatedPrice}</span>
                            <span>Transport: -₹{m.transportCost}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Historical vs Forecast Timeline */}
                {predictionData.historicalTrend && (
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      {language === 'mr' ? 'बाजारभाव वाटचाल (Historical & Forecast Timeline):' : 'Price Trajectory & Forecast Horizon:'}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {predictionData.historicalTrend.map((pt: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-center ${
                            pt.spot
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black'
                              : pt.predicted
                              ? 'bg-teal-50 border-teal-200 text-teal-900'
                              : 'bg-white border-gray-200 text-gray-700'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-bold text-gray-500">{pt.label}</div>
                          <div className="text-sm font-black mt-1">₹{pt.price?.toLocaleString('en-IN')}</div>
                          {pt.predicted && (
                            <div className="text-[9px] font-bold text-teal-700 mt-0.5">AI Forecast</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 2B: MULTI-MANDI RANKING & NET REALISATION DISCOVERY
          =================================================================== */}
      {activeTab === 'rankings' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {language === 'mr' ? '📊 खरी निव्वळ प्राप्ती इंजिन' : '📊 True Net Realisation Engine'}
                </span>
                <span className="text-xs text-emerald-300">Live Agmarknet + Transport Deductions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {language === 'mr' ? 'सर्वोत्तम बाजारपेठ निवड व निव्वळ नफा रँकिंग' : 'Multi-Mandi Ranking & In-Hand Return Optimizer'}
              </h2>
              <p className="text-sm text-emerald-100/80 mt-1 max-w-2xl">
                {language === 'mr'
                  ? 'केवळ वरवरचा बाजारभाव न बघता वाहतूक, हमाली, सेस व संभाव्य नासाडी वजा जाता कोणत्या बाजारात शेतकऱ्याला सर्वाधिक निव्वळ पैसे मिळतील ते शोधा.'
                  : 'Compare regional APMCs by actual in-hand payout after deducting distance transport, handling, mandi cess, and biological decay loss.'}
              </p>

              {/* Crop & Parameter Filters */}
              <div className="mt-6 pt-6 border-t border-emerald-800/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Crop select */}
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                    {language === 'mr' ? 'पीक निवडा:' : 'Select Crop:'}
                  </label>
                  <select
                    value={rankingCrop}
                    onChange={e => {
                      setRankingCrop(e.target.value);
                      fetchRankings(e.target.value, rankingQty, rankingStorageDays);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-900/90 text-white border border-emerald-700/50 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="Onion">🧅 Onion (कांदा)</option>
                    <option value="Tomato">🍅 Tomato (टोमॅटो)</option>
                    <option value="Grapes">🍇 Grapes (द्राक्षे)</option>
                    <option value="Pomegranate">🔴 Pomegranate (डाळिंब)</option>
                    <option value="Soybean">🌱 Soybean (सोयाबीन)</option>
                    <option value="Cabbage">🥬 Cabbage (कोबी)</option>
                    <option value="Sugarcane">🌾 Sugarcane (ऊस)</option>
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                    {language === 'mr' ? 'मालाचे प्रमाण (क्विंटल):' : 'Harvest Quantity (Qtl):'}
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    value={rankingQty}
                    onChange={e => {
                      const val = Number(e.target.value) || 10;
                      setRankingQty(val);
                      fetchRankings(rankingCrop, val, rankingStorageDays);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-900/90 text-white border border-emerald-700/50 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Storage Duration */}
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                    {language === 'mr' ? 'साठवणूक कालावधी:' : 'Storage / Holding Window:'}
                  </label>
                  <select
                    value={rankingStorageDays}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setRankingStorageDays(val);
                      fetchRankings(rankingCrop, rankingQty, val);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-900/90 text-white border border-emerald-700/50 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value={0}>🚀 Immediate Transit (0 Days)</option>
                    <option value={7}>⏳ Short Hold in Shed (7 Days)</option>
                    <option value={30}>❄️ Cold Storage / Ventilated Chawl (30 Days)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {rankingLoading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-agro-light">
              <RefreshCw className="w-8 h-8 text-agro-primary animate-spin mx-auto mb-2" />
              <div className="text-sm font-bold text-agro-text">Calculating Multi-Mandi Realization & Transport Matrix...</div>
            </div>
          ) : rankingData ? (
            <div className="space-y-6">
              {/* Top Mandi Highlight Banner */}
              {rankingData.topMandi && (
                <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-500 shadow-sm relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black">
                          <Award className="w-3.5 h-3.5" />
                          {language === 'mr' ? '#१ सर्वाधिक नफा देणारा बाजार' : '#1 Highest Net Return Mandi'}
                        </span>
                        <span className="text-xs font-bold text-emerald-800">{rankingData.topMandi.district}</span>
                      </div>
                      <h3 className="text-2xl font-black text-agro-dark mt-1">
                        {rankingData.topMandi.mandi}
                      </h3>
                      <div className="text-xs text-gray-600 mt-1 flex flex-wrap items-center gap-4">
                        <span>Distance: <strong>{rankingData.topMandi.distanceKm} km</strong></span>
                        <span>Gross Price: <strong>₹{rankingData.topMandi.grossPrice}/q</strong></span>
                        <span>Total Deductions: <strong className="text-rose-600">-₹{rankingData.topMandi.totalDeductions}/q</strong></span>
                      </div>
                    </div>

                    <div className="text-right md:border-l md:border-emerald-200 md:pl-6">
                      <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        {language === 'mr' ? 'हातात मिळणारा निव्वळ दर' : 'Net In-Hand Realisation'}
                      </div>
                      <div className="text-3xl font-black text-emerald-700">
                        ₹{rankingData.topMandi.netRealisation?.toLocaleString('en-IN')} <span className="text-sm font-bold text-gray-500">/ q</span>
                      </div>
                      <div className="text-xs font-extrabold text-emerald-900 mt-1">
                        Total {rankingQty}Q Payout: ₹{rankingData.topMandi.totalLotRevenue?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Explainable AI Rationale */}
                  {rankingData.explainableInsight && (
                    <div className="mt-4 pt-4 border-t border-emerald-200 text-xs font-medium text-emerald-950 flex items-start gap-2 bg-emerald-100/60 p-3.5 rounded-2xl">
                      <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Explainable AI Rationale: </strong>
                        {language === 'mr' ? rankingData.explainableInsight.mr : rankingData.explainableInsight.en}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mandi Ranking Table */}
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="text-sm font-black text-agro-dark flex items-center gap-2">
                    <Scale className="w-4 h-4 text-agro-primary" />
                    {language === 'mr' ? 'महाराष्ट्र बाजार समित्या तुलना तक्ता (Ranking Matrix)' : 'All Mandis Net In-Hand Comparison'}
                  </h4>
                  <span className="text-xs text-gray-500 font-medium">Sorted by highest net payout</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[11px]">
                      <tr>
                        <th className="px-5 py-3.5 text-left">Rank & Mandi</th>
                        <th className="px-5 py-3.5 text-left">Distance</th>
                        <th className="px-5 py-3.5 text-right">Gross Price</th>
                        <th className="px-5 py-3.5 text-right">Transport</th>
                        <th className="px-5 py-3.5 text-right">Cess & Handling</th>
                        <th className="px-5 py-3.5 text-right">Spoilage Loss</th>
                        <th className="px-5 py-3.5 text-right text-emerald-700 font-black">Net In-Hand (₹/q)</th>
                        <th className="px-5 py-3.5 text-right font-black">Total ({rankingQty}Q)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rankingData.rankedMandis?.map((m: any) => (
                        <tr
                          key={m.mandi}
                          className={`hover:bg-gray-50 transition-colors ${
                            m.isTopRecommendation ? 'bg-emerald-50/40 font-bold' : ''
                          }`}
                        >
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                                m.rank === 1
                                  ? 'bg-emerald-600 text-white'
                                  : m.rank === 2
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-gray-200 text-gray-700'
                              }`}>
                                {m.rank}
                              </span>
                              <div>
                                <div className="font-bold text-agro-dark">{m.mandi}</div>
                                <div className="text-[11px] text-gray-400">{m.district}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                            {m.distanceKm} km
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-right font-semibold text-gray-800">
                            ₹{m.grossPrice?.toLocaleString('en-IN')}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-right text-rose-600 font-medium">
                            -₹{m.transportCost}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-right text-gray-500">
                            -₹{m.handlingCost + m.marketCess}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-right text-amber-700">
                            -₹{m.spoilageLoss}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-right text-base font-black text-emerald-700">
                            ₹{m.netRealisation?.toLocaleString('en-IN')}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-right font-black text-agro-dark">
                            ₹{m.totalLotRevenue?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ===================================================================
          TAB 3: AI QUALITY ASSESSMENT
          =================================================================== */}
      {activeTab === 'quality' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agro-light shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-agro-text flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-agro-primary" />
                <span>{t('aiQuality.title')}</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Visual inspection analyzing size uniformity, color saturation, and surface defects.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={inspectCommodity}
                onChange={e => {
                  setInspectCommodity(e.target.value);
                  runAiQualityTest(e.target.value);
                }}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-agro-bg text-agro-dark outline-none"
              >
                <option value="onion">Onion (कांदा)</option>
                <option value="tomato">Tomato (टोमॅटो)</option>
                <option value="grapes">Grapes (द्राक्षे)</option>
                <option value="pomegranate">Pomegranate (डाळिंब)</option>
              </select>

              <button
                onClick={() => runAiQualityTest(inspectCommodity)}
                disabled={inspecting}
                className="px-4 py-2 rounded-xl bg-agro-primary text-white font-bold text-xs hover:bg-agro-dark transition-colors flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>{inspecting ? t('common.loading') : 'Scan Sample'}</span>
              </button>
            </div>
          </div>

          {qualityResult && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-agro-bg border border-agro-light flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">
                    {t('aiQuality.grade')}
                  </div>
                  <div className="text-4xl font-black text-agro-primary my-1">
                    {qualityResult.grade}
                  </div>
                  <div className="text-xs font-bold text-emerald-700">
                    {qualityResult.confidence}% {t('aiQuality.confidence')}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
                  Status: <span className="font-bold text-emerald-800">Preliminary AI Certified</span>
                </div>
              </div>

              <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-gray-200 space-y-4">
                <h4 className="font-bold text-agro-text text-sm">Computer Vision Parameter Breakdown:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {qualityResult.features &&
                    Object.entries(qualityResult.features).map(([k, v]: any) => (
                      <div key={k} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="text-gray-400 capitalize font-medium">{k}</div>
                        <div className="font-bold text-agro-dark mt-0.5">{String(v)}</div>
                      </div>
                    ))}
                </div>

                {/* Disclaimer */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    {language === 'mr'
                      ? qualityResult.disclaimer?.mr
                      : qualityResult.disclaimer?.en}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          TAB 4: MY FPO AGGREGATION INFO
          =================================================================== */}
      {activeTab === 'fpo' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agro-light shadow-sm">
          <div className="max-w-2xl mb-6">
            <h2 className="text-2xl font-black text-agro-text">Shivneri Agri Farmers Producer Co.</h2>
            <p className="text-xs text-gray-500 mt-1">
              Registered FPC #U01409PN2018PTC178942 • Narayangaon Hub, Junnar Taluka, Pune
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-agro-bg border border-agro-light">
              <div className="text-xs font-bold text-gray-500 uppercase">Trust Score</div>
              <div className="text-3xl font-black text-agro-dark my-1">94 / 100</div>
              <div className="text-[11px] text-emerald-600 font-semibold">128 Completed Trades</div>
            </div>
            <div className="p-4 rounded-2xl bg-agro-bg border border-agro-light">
              <div className="text-xs font-bold text-gray-500 uppercase">Aggregation Hub</div>
              <div className="text-sm font-bold text-agro-dark my-1">Narayangaon Cold Facility</div>
              <div className="text-[11px] text-gray-500">500 MT Ventilated Chawl</div>
            </div>
            <div className="p-4 rounded-2xl bg-agro-bg border border-agro-light">
              <div className="text-xs font-bold text-gray-500 uppercase">Settlement Mechanism</div>
              <div className="text-sm font-bold text-agro-dark my-1">100% Escrow Direct</div>
              <div className="text-[11px] text-gray-500">Direct Bank Deposit within 24 hrs</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium leading-relaxed">
            💡 <strong>Why sell through Shivneri FPC?</strong> Instead of selling single 50-quintal lots at distress farm-gate rates, your FPO aggregates up to 500 quintals, securing institutional buyers (like supermarkets and exporters) at premium rates with 40% lower transport costs.
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: ADD PRODUCE
          (Crop, Expected Quantity, Harvest Date, Location, Photos, FPO selection)
          =================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-agro-light shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-agro-mint text-agro-primary">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-agro-text">
                  {language === 'mr' ? 'नवीन शेतमाल नोंदवा' : 'Add Produce for Aggregation'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {modalSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{modalSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddProduceSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">
                    {language === 'mr' ? 'पीक / शेतमाल' : 'Crop / Commodity'}
                  </label>
                  <select
                    value={commodity}
                    onChange={e => {
                      setCommodity(e.target.value);
                      if (['Onion', 'Tomato', 'Cabbage'].includes(e.target.value)) setCategory('Vegetables');
                      else if (['Grapes', 'Pomegranate'].includes(e.target.value)) setCategory('Fruits');
                      else setCategory('Field Crops');
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white outline-none focus:border-agro-primary"
                  >
                    <option value="Onion">Onion (कांदा)</option>
                    <option value="Tomato">Tomato (टोमॅटो)</option>
                    <option value="Grapes">Grapes (द्राक्षे)</option>
                    <option value="Pomegranate">Pomegranate (डाळिंब)</option>
                    <option value="Soybean">Soybean (सोयाबीन)</option>
                    <option value="Cabbage">Cabbage (कोबी)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">
                    {language === 'mr' ? 'अपेक्षित प्रमाण (क्विंटल)' : 'Expected Quantity (Quintals)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="5"
                    max="1000"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-agro-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">
                    {language === 'mr' ? 'कापणी तारीख' : 'Harvest Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={harvestDate}
                    onChange={e => setHarvestDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-agro-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">
                    {language === 'mr' ? 'ठिकाण' : 'Farm Location'}
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-agro-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  {language === 'mr' ? 'संबंधित FPO निवडा' : 'Select Designated FPO (Pune)'}
                </label>
                <select
                  value={assignedFpoId}
                  onChange={e => setAssignedFpoId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white outline-none focus:border-agro-primary"
                >
                  <option value="usr_fpo_01">Shivneri Agri Farmers Producer Co. (Narayangaon, Junnar)</option>
                  <option value="fpo_02">Junnar Taluka Agro Farmers FPC (Otur, Junnar)</option>
                  <option value="fpo_03">Baramati Agro Vikas FPC (Baramati)</option>
                  <option value="fpo_04">Khed Farmers Producer Co. Ltd. (Chakan)</option>
                </select>
              </div>

              {/* Preliminary AI Quality Scan Checkbox */}
              <div className="p-3.5 rounded-2xl bg-agro-mint border border-agro-light flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-agro-primary" />
                  <div>
                    <div className="text-xs font-bold text-agro-dark">Run Preliminary AI Quality Scan</div>
                    <div className="text-[10px] text-gray-500">Auto-evaluates produce grade (Grade A, 92% Conf.)</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-agro-primary text-white text-[10px] font-extrabold">
                  Active
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-2xl bg-agro-primary hover:bg-agro-dark text-white font-bold text-sm shadow-md shadow-agro-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{submitting ? t('common.loading') : 'Submit to FPO for Aggregation'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
