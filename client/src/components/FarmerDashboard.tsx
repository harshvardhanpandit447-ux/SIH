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
  RefreshCw
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'produce' | 'market' | 'quality' | 'fpo'>('produce');
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

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    fetchFarmerData();
    fetchPrediction('onion', 3);
    runAiQualityTest('onion');
  }, []);

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
          TAB 2: ML FUTURE PRICE PREDICTION
          =================================================================== */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agro-light shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-agro-text flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-agro-primary" />
                  <span>{language === 'mr' ? 'ML भविष्यातील बाजारभाव अंदाज' : 'ML Future Price Prediction Model'}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Time-series regression incorporating seasonality, APMC arrival volumes, and storage costs.
                </p>
              </div>

              {/* Commodity & Horizon Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={mlCommodity}
                  onChange={e => {
                    setMlCommodity(e.target.value);
                    fetchPrediction(e.target.value, mlHorizon);
                  }}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-agro-bg text-agro-dark outline-none"
                >
                  <option value="onion">Onion (कांदा)</option>
                  <option value="tomato">Tomato (टोमॅटो)</option>
                  <option value="grapes">Grapes (द्राक्षे)</option>
                  <option value="pomegranate">Pomegranate (डाळिंब)</option>
                  <option value="soybean">Soybean (सोयाबीन)</option>
                </select>

                <select
                  value={mlHorizon}
                  onChange={e => {
                    const h = Number(e.target.value);
                    setMlHorizon(h);
                    fetchPrediction(mlCommodity, h);
                  }}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-agro-bg text-agro-dark outline-none"
                >
                  <option value={1}>1 Week Ahead</option>
                  <option value={2}>2 Weeks Ahead</option>
                  <option value={3}>3 Weeks Ahead</option>
                  <option value={4}>4 Weeks Ahead</option>
                </select>
              </div>
            </div>

            {predicting ? (
              <div className="py-12 text-center text-sm font-bold text-gray-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-agro-primary mb-2" />
                Running Time-Series ML Regressor...
              </div>
            ) : predictionData ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Predicted Range Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-agro-bright/40">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Predicted Range ({mlHorizon} Weeks)
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-agro-dark my-2">
                    {predictionData.predictedDisplay}
                  </div>
                  <div className="text-xs font-bold text-emerald-800 flex items-center justify-between mt-3 pt-3 border-t border-emerald-200/60">
                    <span>Confidence Score:</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-extrabold">
                      {predictionData.confidenceScore}%
                    </span>
                  </div>
                </div>

                {/* Sell Now vs Wait vs Store Card */}
                <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 lg:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-lg bg-amber-500 text-white font-black text-xs uppercase">
                        {predictionData.recommendation}
                      </span>
                      <span className="text-xs font-bold text-amber-900">
                        {language === 'mr' ? 'कृषी अर्थतज्ज्ञ सल्ला' : 'Agri-Economic Advisory'}
                      </span>
                    </div>
                    <p className="text-sm text-amber-900/90 leading-relaxed font-medium">
                      {language === 'mr'
                        ? predictionData.recommendationText?.mr
                        : predictionData.recommendationText?.en}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-amber-200 text-xs">
                    <div>
                      <span className="text-gray-500">Estimated Holding Cost:</span>
                      <div className="font-bold text-amber-900">₹{predictionData.holdingCostEstimate} / q</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Expected Net Gain:</span>
                      <div className="font-bold text-emerald-700">+₹{predictionData.netGainEstimate} / q</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
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
