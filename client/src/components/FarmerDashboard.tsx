import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  tEntity,
  tCrop,
  tMandi,
  tStatus,
  tGrade
} from '../utils/translationHelper';
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
  Award,
  ArrowRightLeft,
  Send,
  Clock,
  XCircle,
  Upload
} from 'lucide-react';

const CROP_SAMPLE_IMAGES: Record<string, string> = {
  onion: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600',
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600',
  grapes: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=600',
  pomegranate: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600',
  soybean: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600',
  cabbage: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600',
  sugarcane: 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?w=600'
};

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const isMr = language === 'mr';

  const [activeTab, setActiveTab] = useState<'produce' | 'market' | 'rankings' | 'quality' | 'fpo'>('produce');
  const [produces, setProduces] = useState<any[]>([]);
  const [_fpos, setFpos] = useState<any[]>([]);

  // FPO Membership & Switch Requests state
  const [joinedFpoId, setJoinedFpoId] = useState('usr_fpo_01');
  const [joinedFpoName, setJoinedFpoName] = useState('Shivneri Agri Farmers Producer Co.');
  const [switchRequests, setSwitchRequests] = useState<any[]>([]);
  const [availableFpos, setAvailableFpos] = useState<any[]>([]);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [targetFpoId, setTargetFpoId] = useState('');
  const [switchReason, setSwitchReason] = useState('');
  const [switchSubmitting, setSwitchSubmitting] = useState(false);
  const [switchSuccessMsg, setSwitchSuccessMsg] = useState<string | null>(null);
  const [switchErrorMsg, setSwitchErrorMsg] = useState<string | null>(null);

  // Form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [commodity, setCommodity] = useState('Onion');
  const [category, setCategory] = useState('Vegetables');
  const [quantity, setQuantity] = useState('');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
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
  const [customQualityImage, setCustomQualityImage] = useState<string | null>(null);

  // Multi-Mandi Ranking & Net Realisation State
  const [rankingCrop, setRankingCrop] = useState('Onion');
  const [rankingQty, setRankingQty] = useState(50);
  const [rankingStorageDays, setRankingStorageDays] = useState(0);
  const [rankingData, setRankingData] = useState<any>(null);
  const [rankingLoading, setRankingLoading] = useState(false);

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    fetchFarmerData();
    fetchFpoMembership();
    fetchPrediction('onion', 3);
    runAiQualityTest('onion');
    fetchRankings('Onion', 50, 0);
  }, []);

  const fetchFpoMembership = async () => {
    const farmerId = user?.id || 'usr_farmer_01';
    try {
      const res = await fetch(`${API_BASE}/farmer/fpo-membership/${farmerId}`);
      const data = await res.json();
      if (data.success) {
        if (data.joinedFpoId) {
          setJoinedFpoId(data.joinedFpoId);
          setAssignedFpoId(data.joinedFpoId);
        }
        if (data.joinedFpoName) setJoinedFpoName(data.joinedFpoName);
        if (data.requests) setSwitchRequests(data.requests);
        if (data.availableFpos && data.availableFpos.length > 0) {
          setAvailableFpos(data.availableFpos);
          const other = data.availableFpos.find((f: any) => f.id !== data.joinedFpoId && f.userId !== data.joinedFpoId);
          if (other) setTargetFpoId(other.id);
        }
      }
    } catch (err) {
      console.error('Error fetching FPO membership:', err);
    }
  };

  const handleSwitchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSwitchSubmitting(true);
    setSwitchSuccessMsg(null);
    setSwitchErrorMsg(null);

    const targetFpoObj = availableFpos.find(f => f.id === targetFpoId || f.userId === targetFpoId);
    const targetName = targetFpoObj?.name || 'Target FPC';

    try {
      const res = await fetch(`${API_BASE}/farmer/fpo-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: user?.id || 'usr_farmer_01',
          farmerName: user?.name || 'Sopanrao Patil',
          farmerMobile: user?.mobile || '9822012345',
          farmerVillage: user?.village || 'Otur',
          farmerTaluka: user?.taluka || 'Junnar',
          farmerDistrict: user?.district || 'Pune',
          currentFpoId: joinedFpoId,
          currentFpoName: joinedFpoName,
          targetFpoId,
          targetFpoName: targetName,
          reason: switchReason || (isMr ? 'स्थानिक शीतगृह व एकत्रीकरण केंद्र सोयीचे आहे' : 'Closer storage and aggregation facility')
        })
      });
      const data = await res.json();
      if (data.success) {
        setSwitchSuccessMsg(
          isMr 
            ? `✅ ${tEntity(targetName, language)} कडे FPO बदली विनंती पाठवली! FPO कडून मंजुरी मिळताच आपली FPO आपोआप बदलेल.`
            : `✅ Switch request sent to ${targetName}! Once accepted, your joined FPO will be updated.`
        );
        fetchFpoMembership();
        setTimeout(() => {
          setIsSwitchModalOpen(false);
          setSwitchSuccessMsg(null);
        }, 2500);
      } else {
        setSwitchErrorMsg(data.error || 'Failed to submit switch request');
      }
    } catch (err) {
      setSwitchErrorMsg('Error submitting request. Please check backend connection.');
    } finally {
      setSwitchSubmitting(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const res = await fetch(`${API_BASE}/farmer/fpo-request/${requestId}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchFpoMembership();
      }
    } catch (err) {
      console.error('Error cancelling request:', err);
    }
  };

  const fetchRankings = async (crop: string, qty: number, days: number) => {
    setRankingLoading(true);
    try {
      const res = await fetch(`${API_BASE}/market/rankings?crop=${crop}&quantity=${qty}&storageDays=${days}`);
      const data = await res.json();
      if (data.success) {
        setRankingData(data);
      }
    } catch (err) {
      console.error('Error fetching rankings:', err);
    } finally {
      setRankingLoading(false);
    }
  };

  const fetchFarmerData = async () => {
    try {
      const res = await fetch(`${API_BASE}/farmer/dashboard/usr_farmer_01`);
      const data = await res.json();
      if (data.produces) setProduces(data.produces);
      if (data.fpos) setFpos(data.fpos);
    } catch (err) {
      console.error('Error loading farmer data:', err);
    }
  };

  const fetchPrediction = async (crop: string, horizon: number) => {
    setPredicting(true);
    try {
      const res = await fetch(`${API_BASE}/ml/predict-future-price?commodity=${encodeURIComponent(crop)}&horizonWeeks=${horizon}`);
      const data = await res.json();
      if (data && (data.success || data.predictedRange || data.predictedDisplay)) {
        setPredictionData(data);
      }
    } catch (err) {
      console.error('Error fetching ML prediction:', err);
    } finally {
      setPredicting(false);
    }
  };

  const runAiQualityTest = async (crop: string, customImg?: string) => {
    setInspecting(true);
    try {
      const activeImg = customImg || customQualityImage || CROP_SAMPLE_IMAGES[crop.toLowerCase()] || CROP_SAMPLE_IMAGES.onion;
      const res = await fetch(`${API_BASE}/ml/assess-quality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commodity: crop,
          photoUrl: activeImg
        })
      });
      const data = await res.json();
      if (data && (data.success || data.grade)) {
        setQualityResult(data);
      }
    } catch (err) {
      console.error('AI Quality test failed:', err);
    } finally {
      setInspecting(false);
    }
  };

  const handleAddProduceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fpoName = assignedFpoId === 'usr_fpo_01'
        ? 'Shivneri Agri Farmers Producer Co.'
        : assignedFpoId === 'fpo_02'
        ? 'Junnar Taluka Agro Farmers FPC'
        : assignedFpoId === 'fpo_03'
        ? 'Baramati Agro Vikas FPC'
        : 'Khed Farmers Producer Co. Ltd.';

      const res = await fetch(`${API_BASE}/farmer/add-produce`, {
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
        setModalSuccess(
          isMr
            ? 'शेतमाल एकत्रीकरण व गुणवत्ता पडताळणीसाठी FPO कडे यशस्वीरित्या दाखल झाला!'
            : 'Produce submitted to FPO for aggregation & quality verification!'
        );
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
              🌾 {isMr ? 'शेतकरी पोर्टल' : 'Farmer Portal'} • {tMandi(user?.village || 'Otur', language)}, {tMandi('Pune', language)}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isMr ? 'स्वागत आहे,' : 'Welcome back,'} {tEntity(user?.name || 'Sopanrao Patil', language)}
            </h1>
            <p className="text-sm text-emerald-200 mt-1 max-w-xl">
              {isMr
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
              <span>{isMr ? '+ शेतमाल जोडा' : '+ Add Produce'}</span>
            </button>
            <button
              onClick={() => setActiveTab('market')}
              className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/20 text-white font-bold text-sm transition-colors flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{isMr ? 'बाजार अंदाज' : 'ML Forecast'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-5 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {isMr ? 'सध्याचा बाजारभाव (कांदा)' : 'Current Mandi Rate (Onion)'}
          </div>
          <div className="text-2xl font-black text-agro-dark">
            ₹2,800 <span className="text-xs font-semibold text-gray-400">/ {isMr ? 'क्विंटल' : 'q'}</span>
          </div>
          <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <span>▲ +5.6% {tMandi('Pune Gultekdi', language)}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {isMr ? 'ML अंदाजित भाव कक्षा' : 'ML Predicted Range'}
          </div>
          <div className="text-2xl font-black text-agro-primary">
            ₹3,050 – ₹3,180
          </div>
          <div className="text-xs text-blue-600 font-bold mt-1">
            {isMr ? '८५% अचूकता (३ आठवडे)' : '85% Confidence (3-Weeks)'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {isMr ? 'अपेक्षित निव्वळ प्राप्ती' : 'Est. Net Realisation'}
          </div>
          <div className="text-2xl font-black text-emerald-800">
            ₹2,560 <span className="text-xs font-semibold text-gray-400">/ {isMr ? 'क्विंटल' : 'q'}</span>
          </div>
          <div className="text-xs text-gray-500 font-medium mt-1">
            {isMr ? 'FPO वाहतूक व हाताळणी खर्च वजा जाता' : 'After FPO transport & handling'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {isMr ? 'माझी FPO संस्था' : 'Assigned FPO'}
          </div>
          <div className="text-lg font-bold text-agro-dark truncate">
            {tEntity('Shivneri Agri FPC', language)}
          </div>
          <div className="text-xs text-emerald-700 font-bold mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>94/100 {isMr ? 'विश्वासार्हता गुण' : 'Trust Score'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 mb-6 gap-2 pb-1">
        {[
          { id: 'produce', label: isMr ? 'माझा शेतमाल' : 'My Produce & Lots', icon: Package },
          { id: 'market', label: isMr ? 'ML दर अंदाज' : 'ML Price Prediction', icon: TrendingUp },
          { id: 'rankings', label: isMr ? 'बाजारपेठ रँकिंग (Net Realisation)' : 'Mandi Rankings (Net ₹)', icon: Scale },
          { id: 'quality', label: isMr ? 'AI प्रतवारी' : 'AI Quality Scan', icon: Sparkles },
          { id: 'fpo', label: isMr ? 'FPO माहिती' : 'FPO Aggregation', icon: Building2 }
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

      {/* TAB 1: MY PRODUCE & AGGREGATION STATUS */}
      {activeTab === 'produce' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-agro-text">
              {isMr ? 'दाखल केलेला शेतमाल' : 'Submitted Produce Submissions'}
            </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-bold text-agro-primary hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isMr ? 'नवीन शेतमाल जोडा' : 'Add New Produce'}</span>
            </button>
          </div>

          {produces.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-agro-light p-6">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <div className="font-bold text-gray-600">{isMr ? 'अद्याप शेतमाल नोंदवलेला नाही' : 'No produce submitted yet'}</div>
              <p className="text-xs text-gray-400 mt-1 mb-4">
                {isMr
                  ? 'तुमचा शेतमाल FPO कडे एकत्रीकरणासाठी दाखल करण्यासाठी वर दिलेल्या बटणावर क्लिक करा.'
                  : 'Click Add Produce to submit your harvest to your local FPO for aggregation.'}
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-agro-primary text-white text-xs font-bold"
              >
                {isMr ? '+ कांदा किंवा टोमॅटो जोडा' : '+ Add Onion or Tomato'}
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
                          <span className="text-2xl font-black text-agro-text">
                            {tCrop(item.commodity, language)}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            {tGrade(item.qualityGrade || 'Grade A', language)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {tCrop(item.category, language)} • {isMr ? 'कापणी:' : 'Harvest:'} {item.harvestDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-agro-dark">
                          {item.quantity} <span className="text-xs font-normal">{isMr ? 'क्विंटल' : (item.unit || 'Quintal')}</span>
                        </div>
                        <span className="inline-block mt-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900">
                          {tStatus(item.status || 'PENDING_FPO_REVIEW', language)}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-agro-bg border border-agro-light/80 space-y-1.5 text-xs text-agro-text/80 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{isMr ? 'नियुक्त FPO:' : 'Assigned FPO:'}</span>
                        <span className="font-bold text-agro-dark">
                          {tEntity(item.assignedFpoName || 'Shivneri Agri Farmers Producer Co.', language)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{isMr ? 'एकत्रीकरण लॉट:' : 'Aggregation Lot:'}</span>
                        <span className="font-bold text-emerald-700">
                          {item.aggregatedLotNumber || item.lotId || (isMr ? 'लॉट तयार करण्याचे काम सुरू' : 'Lot Bundling in Progress')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{isMr ? 'अपेक्षित निव्वळ दर:' : 'Est. Net Realisation:'}</span>
                        <span className="font-bold text-agro-primary">₹{item.estimatedNetRealisation || 2560} {isMr ? '/ क्विंटल' : '/ q'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Status Progression */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-[11px] font-bold text-gray-500 mb-2">
                      {isMr ? 'प्रक्रिया टप्पे (Workflow Progression):' : 'Workflow Progression:'}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-emerald-700">{isMr ? '१. दाखल केले ✓' : '1. Submitted ✓'}</span>
                      <span className="text-emerald-700">{isMr ? '२. FPO तपासणी ✓' : '2. FPO Verified ✓'}</span>
                      <span className={item.status === 'AGGREGATED_INTO_LOT' ? 'text-emerald-700 font-extrabold' : 'text-gray-400'}>
                        {isMr ? '३. लॉट तयार' : '3. Lot Aggregated'}
                      </span>
                      <span className="text-gray-400">{isMr ? '४. रक्कम जमा' : '4. Payout'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ML FUTURE PRICE PREDICTION & CROP INTELLIGENCE */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agro-light shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-agro-text flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-agro-primary" />
                  <span>{t('marketIntel.title')}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {t('marketIntel.subtitle')}
                </p>
              </div>

              {/* Selector Bar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={mlCommodity}
                  onChange={e => {
                    setMlCommodity(e.target.value);
                    fetchPrediction(e.target.value, mlHorizon);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-agro-bg text-agro-dark outline-none focus:border-agro-primary"
                >
                  <option value="onion">🧅 Onion (कांदा)</option>
                  <option value="tomato">🍅 Tomato (टोमॅटो)</option>
                  <option value="grapes">🍇 Grapes (द्राक्षे)</option>
                  <option value="pomegranate">🍎 Pomegranate (डाळिंब)</option>
                  <option value="soybean">🌱 Soybean (सोयाबीन)</option>
                  <option value="sugarcane">🎋 Sugarcane (ऊस)</option>
                </select>

                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {[1, 2, 3, 4].map(w => (
                    <button
                      key={w}
                      onClick={() => {
                        setMlHorizon(w);
                        fetchPrediction(mlCommodity, w);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        mlHorizon === w
                          ? 'bg-agro-primary text-white shadow-xs'
                          : 'text-gray-600 hover:text-agro-dark'
                      }`}
                    >
                      {w}{isMr ? ' आठवडे' : 'W'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {predicting ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 text-agro-primary animate-spin mx-auto mb-2" />
                <div className="text-sm font-bold text-agro-text">
                  {isMr ? 'ML मॉडेलद्वारे दर अंदाज काढला जात आहे...' : 'Running ML Time-Series & Seasonal Drift Models...'}
                </div>
              </div>
            ) : predictionData ? (
              <div className="space-y-6">
                {/* 1. Crop Attributes Badge */}
                {predictionData.cropAttributes && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-agro-dark to-emerald-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{predictionData.cropAttributes.icon}</span>
                      <div>
                        <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                          {isMr ? 'पीक माहिती व साठवणूक तंत्रज्ञान' : 'Crop Profile & Post-Harvest Storage'}
                        </div>
                        <h3 className="text-lg font-black">
                          {tCrop(predictionData.commodity, language)}
                        </h3>
                        <p className="text-xs text-white/80">
                          {isMr ? 'प्रमुख वाण: ' : 'Key Varieties: '}
                          <span className="font-semibold text-emerald-200">{predictionData.cropAttributes.primaryVarieties}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                        <div className="text-[10px] text-emerald-300 uppercase font-bold flex items-center gap-1">
                          <Warehouse className="w-3 h-3" />
                          <span>{isMr ? 'साठवणूक पद्धत' : 'Storage Method'}</span>
                        </div>
                        <div className="font-bold">{predictionData.cropAttributes.storageType}</div>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                        <div className="text-[10px] text-emerald-300 uppercase font-bold">{isMr ? 'टिकाऊपणा' : 'Safe Window'}</div>
                        <div className="font-bold">{predictionData.cropAttributes.safeStorageDuration}</div>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                        <div className="text-[10px] text-emerald-300 uppercase font-bold flex items-center gap-1">
                          <Scale className="w-3 h-3" />
                          <span>{isMr ? 'घट / नुकसान' : 'Shrinkage Rate'}</span>
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
                        <span>{isMr ? 'अपेक्षित बाजारभाव' : 'Predicted Price Range'}</span>
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
                        {isMr ? 'सध्याचा स्पॉट दर: ' : 'Current Spot Rate: '}
                        <span className="font-bold text-agro-dark">₹{predictionData.currentPrice?.toLocaleString('en-IN')} / {isMr ? 'क्विंटल' : 'q'}</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-emerald-200/70 text-xs flex items-center justify-between">
                      <span className="text-gray-600 font-medium">{isMr ? 'मॉडेल अचूकता गुण:' : 'Model Confidence Score:'}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-black">
                        {predictionData.confidenceScore}%
                      </span>
                    </div>
                  </div>

                  {/* Advisory Card */}
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
                            {isMr
                              ? (predictionData.recommendation === 'STORE' ? 'साठवा' : predictionData.recommendation === 'WAIT' ? 'वाट पहा' : 'विका')
                              : predictionData.recommendation}
                          </span>
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5 text-amber-700" />
                            {isMr ? 'कृषी अर्थतज्ज्ञ AI सल्ला' : 'Agri-Economic AI Advisory'}
                          </span>
                        </div>
                        <span className="text-[11px] font-extrabold text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                          {predictionData.recommendationVerdict}
                        </span>
                      </div>

                      <p className="text-sm text-amber-950 leading-relaxed font-medium">
                        {isMr
                          ? predictionData.recommendationText?.mr
                          : predictionData.recommendationText?.en}
                      </p>
                    </div>

                    {/* Economics summary */}
                    <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-amber-200 text-xs">
                      <div>
                        <span className="text-gray-500">{isMr ? 'अपेक्षित वाढ' : 'Gross Appreciation'}:</span>
                        <div className="font-black text-agro-dark">
                          +₹{predictionData.storageEconomics?.grossGain ?? predictionData.netGainEstimate} / {isMr ? 'क्विंटल' : 'q'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">{isMr ? 'साठवणूक + घट खर्च' : 'Holding + Spoilage'}:</span>
                        <div className="font-black text-rose-700">
                          -₹{predictionData.storageEconomics?.totalHoldingCost ?? predictionData.holdingCostEstimate} / {isMr ? 'क्विंटल' : 'q'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">{isMr ? 'निव्वळ परतावा' : 'True Net Realization'}:</span>
                        <div className={`font-black text-sm ${
                          (predictionData.storageEconomics?.netGain ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {(predictionData.storageEconomics?.netGain ?? 0) >= 0 ? '+' : ''}
                          ₹{predictionData.storageEconomics?.netGain ?? predictionData.netGainEstimate} / {isMr ? 'क्विंटल' : 'q'}
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
                        {isMr
                          ? `${tCrop(predictionData.commodity, language)} साठी प्रमुख बाजार घटक (Market Drivers)`
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
                                {isMr ? (driver.impact === 'POSITIVE' ? 'सकारात्मक' : 'नकारात्मक') : driver.impact}
                              </span>
                              <span className="text-xs font-black text-agro-dark">{driver.weight}</span>
                            </div>
                            <h5 className="font-bold text-xs text-agro-text mb-1">{driver.factor}</h5>
                            <p className="text-[11px] text-gray-600 leading-normal">
                              {isMr ? driver.descriptionMr : driver.descriptionEn}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Regional Mandi Matrix */}
                {predictionData.mandiComparison && predictionData.mandiComparison.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-agro-primary" />
                        <h4 className="text-sm font-black text-agro-text">
                          {isMr ? 'पुणे जिल्ह्यातील प्रमुख बाजारपेठा दर तुलना (Mandi Arbitrage)' : 'Regional Mandi Realization Comparison'}
                        </h4>
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {isMr ? 'वाहतूक खर्च वजा करून निव्वळ परतावा' : 'Net in-hand price after transport deductions'}
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
                            <span className="text-xs font-black text-agro-dark">
                              {tMandi(m.mandi, language)}
                            </span>
                            {m.isBestOption && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                                <Award className="w-3 h-3" />
                                {isMr ? 'सर्वोत्तम परतावा' : 'Top Realization'}
                              </span>
                            )}
                          </div>
                          <div className="text-lg font-black text-agro-dark">
                            ₹{m.netRealisation?.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-gray-500">/ {isMr ? 'क्विंटल (निव्वळ)' : 'q (Net)'}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-1 flex justify-between">
                            <span>{isMr ? 'बाजारभाव:' : 'Mandi Price:'} ₹{m.estimatedPrice}</span>
                            <span>{isMr ? 'वाहतूक:' : 'Transport:'} -₹{m.transportCost}</span>
                          </div>
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

      {/* TAB 2B: MULTI-MANDI RANKING */}
      {activeTab === 'rankings' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isMr ? '📊 खरी निव्वळ प्राप्ती इंजिन' : '📊 True Net Realisation Engine'}
                </span>
                <span className="text-xs text-emerald-300">
                  {isMr ? 'थेट बाजारभाव + वाहतूक खर्च वजावट' : 'Live Agmarknet + Transport Deductions'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {isMr ? 'सर्वोत्तम बाजारपेठ निवड व निव्वळ नफा रँकिंग' : 'Multi-Mandi Ranking & In-Hand Return Optimizer'}
              </h2>
              <p className="text-sm text-emerald-100/80 mt-1 max-w-2xl">
                {isMr
                  ? 'केवळ वरवरचा बाजारभाव न बघता वाहतूक, हमाली, सेस व संभाव्य नासाडी वजा जाता कोणत्या बाजारात शेतकऱ्याला सर्वाधिक निव्वळ पैसे मिळतील ते शोधा.'
                  : 'Compare regional APMCs by actual in-hand payout after deducting distance transport, handling, mandi cess, and biological decay loss.'}
              </p>

              {/* Filters */}
              <div className="mt-6 pt-6 border-t border-emerald-800/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                    {isMr ? 'पीक निवडा:' : 'Select Crop:'}
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

                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                    {isMr ? 'मालाचे प्रमाण (क्विंटल):' : 'Harvest Quantity (Qtl):'}
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

                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                    {isMr ? 'साठवणूक कालावधी:' : 'Storage / Holding Window:'}
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
                    <option value={0}>{isMr ? '🚀 त्वरित वाहतूक (० दिवस)' : '🚀 Immediate Transit (0 Days)'}</option>
                    <option value={7}>{isMr ? '⏳ साध्या शेडमध्ये साठवणूक (७ दिवस)' : '⏳ Short Hold in Shed (7 Days)'}</option>
                    <option value={30}>{isMr ? '❄️ कांदा चाळ / शीतगृह (३० दिवस)' : '❄️ Cold Storage / Ventilated Chawl (30 Days)'}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {rankingLoading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-agro-light">
              <RefreshCw className="w-8 h-8 text-agro-primary animate-spin mx-auto mb-2" />
              <div className="text-sm font-bold text-agro-text">
                {isMr ? 'बाजारपेठ परतावा व वाहतूक गणित काढले जात आहे...' : 'Calculating Multi-Mandi Realization & Transport Matrix...'}
              </div>
            </div>
          ) : rankingData ? (
            <div className="space-y-6">
              {rankingData.topMandi && (
                <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-500 shadow-sm relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black">
                          <Award className="w-3.5 h-3.5" />
                          {isMr ? '#१ सर्वाधिक नफा देणारा बाजार' : '#1 Highest Net Return Mandi'}
                        </span>
                        <span className="text-xs font-bold text-emerald-800">{tMandi(rankingData.topMandi.district, language)}</span>
                      </div>
                      <h3 className="text-2xl font-black text-agro-dark mt-1">
                        {tMandi(rankingData.topMandi.mandi, language)}
                      </h3>
                      <div className="text-xs text-gray-600 mt-1 flex flex-wrap items-center gap-4">
                        <span>{isMr ? 'अंतर:' : 'Distance:'} <strong>{rankingData.topMandi.distanceKm} km</strong></span>
                        <span>{isMr ? 'एकूण भाव:' : 'Gross Price:'} <strong>₹{rankingData.topMandi.grossPrice}/{isMr ? 'क्विंटल' : 'q'}</strong></span>
                        <span>{isMr ? 'एकूण वजावट:' : 'Total Deductions:'} <strong className="text-rose-600">-₹{rankingData.topMandi.totalDeductions}/{isMr ? 'क्विंटल' : 'q'}</strong></span>
                      </div>
                    </div>

                    <div className="text-right md:border-l md:border-emerald-200 md:pl-6">
                      <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        {isMr ? 'हातात मिळणारा निव्वळ दर' : 'Net In-Hand Realisation'}
                      </div>
                      <div className="text-3xl font-black text-emerald-700">
                        ₹{rankingData.topMandi.netRealisation?.toLocaleString('en-IN')} <span className="text-sm font-bold text-gray-500">/ {isMr ? 'क्विंटल' : 'q'}</span>
                      </div>
                      <div className="text-xs font-extrabold text-emerald-900 mt-1">
                        {isMr ? `एकूण ${rankingQty} क्विंटलचे उत्पन्न: ` : `Total ${rankingQty}Q Payout: `}₹{rankingData.topMandi.totalLotRevenue?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="text-sm font-black text-agro-dark flex items-center gap-2">
                    <Scale className="w-4 h-4 text-agro-primary" />
                    {isMr ? 'महाराष्ट्र बाजार समित्या तुलना तक्ता (Ranking Matrix)' : 'All Mandis Net In-Hand Comparison'}
                  </h4>
                  <span className="text-xs text-gray-500 font-medium">
                    {isMr ? 'सर्वाधिक निव्वळ परताव्यानुसार क्रमवारी' : 'Sorted by highest net payout'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[11px]">
                      <tr>
                        <th className="px-5 py-3.5 text-left">{isMr ? 'रँक व बाजार समिती' : 'Rank & Mandi'}</th>
                        <th className="px-5 py-3.5 text-left">{isMr ? 'अंतर' : 'Distance'}</th>
                        <th className="px-5 py-3.5 text-right">{isMr ? 'एकूण भाव' : 'Gross Price'}</th>
                        <th className="px-5 py-3.5 text-right">{isMr ? 'वाहतूक खर्च' : 'Transport'}</th>
                        <th className="px-5 py-3.5 text-right">{isMr ? 'सेस व हमाली' : 'Cess & Handling'}</th>
                        <th className="px-5 py-3.5 text-right">{isMr ? 'घट / नुकसान' : 'Spoilage Loss'}</th>
                        <th className="px-5 py-3.5 text-right text-emerald-700 font-black">{isMr ? 'निव्वळ दर (₹/क्विंटल)' : 'Net In-Hand (₹/q)'}</th>
                        <th className="px-5 py-3.5 text-right font-black">{isMr ? `एकूण (${rankingQty} क्विंटल)` : `Total (${rankingQty}Q)`}</th>
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
                                <div className="font-bold text-agro-dark">{tMandi(m.mandi, language)}</div>
                                <div className="text-[11px] text-gray-400">{tMandi(m.district, language)}</div>
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

      {/* TAB 3: AI QUALITY ASSESSMENT */}
      {activeTab === 'quality' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agro-light shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-black text-agro-text flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-agro-primary" />
                <span>{t('aiQuality.title')}</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {t('aiQuality.subtitle')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={inspectCommodity}
                onChange={e => {
                  setInspectCommodity(e.target.value);
                  runAiQualityTest(e.target.value);
                }}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-agro-bg text-agro-dark outline-none cursor-pointer"
              >
                <option value="onion">🧅 Onion (कांदा)</option>
                <option value="tomato">🍅 Tomato (टोमॅटो)</option>
                <option value="grapes">🍇 Grapes (द्राक्षे)</option>
                <option value="pomegranate">🍎 Pomegranate (डाळिंब)</option>
                <option value="soybean">🌱 Soybean (सोयाबीन)</option>
                <option value="cabbage">🥬 Cabbage (कोबी)</option>
              </select>

              <label className="px-3 py-2 rounded-xl bg-agro-mint border border-agro-light text-agro-dark font-bold text-xs hover:bg-agro-primary hover:text-white transition-all flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>{isMr ? 'फोटो अपलोड' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = evt => {
                        const url = evt.target?.result as string;
                        setCustomQualityImage(url);
                        runAiQualityTest(inspectCommodity, url);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              <button
                onClick={() => runAiQualityTest(inspectCommodity)}
                disabled={inspecting}
                className="px-4 py-2 rounded-xl bg-agro-primary text-white font-bold text-xs hover:bg-agro-dark transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Camera className={`w-4 h-4 ${inspecting ? 'animate-spin' : ''}`} />
                <span>{inspecting ? (isMr ? 'तपासणी सुरू...' : 'Scanning...') : (isMr ? 'तपासणी करा' : 'Scan Sample')}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Sample Scanner Preview */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="relative rounded-3xl overflow-hidden border-2 border-agro-light bg-slate-900 aspect-square sm:aspect-auto sm:h-72 flex items-center justify-center group shadow-inner">
                <img
                  src={customQualityImage || CROP_SAMPLE_IMAGES[inspectCommodity.toLowerCase()] || CROP_SAMPLE_IMAGES.onion}
                  alt={inspectCommodity}
                  className="w-full h-full object-cover"
                />

                {/* Live Scanner Animation Overlay */}
                {inspecting && (
                  <div className="absolute inset-0 bg-agro-primary/20 backdrop-blur-[1px] flex flex-col justify-between p-4 overflow-hidden pointer-events-none">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce" />
                    <div className="text-center font-black text-white text-xs tracking-wider bg-black/60 py-1.5 px-3 rounded-full mx-auto backdrop-blur-md">
                      AI COMPUTER VISION SCANNING...
                    </div>
                  </div>
                )}

                {/* Crop Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-black flex items-center gap-1.5">
                  <span>{tCrop(inspectCommodity, language)}</span>
                </div>

                {/* Preliminary Certified Badge */}
                {qualityResult && !inspecting && (
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-black flex items-center gap-1.5 shadow-lg">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{qualityResult.confidence}% {isMr ? 'अचूकता' : 'Confidence'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quality Analysis Results */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
              {qualityResult ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-agro-mint to-emerald-50 border border-agro-light">
                      <div className="text-[11px] font-bold text-gray-500 uppercase">
                        {t('aiQuality.grade')}
                      </div>
                      <div className="text-3xl font-black text-agro-dark my-1">
                        {tGrade(qualityResult.grade, language)}
                      </div>
                      <div className="text-xs font-bold text-emerald-700">
                        {qualityResult.confidence}% {t('aiQuality.confidence')}
                      </div>
                    </div>

                    <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                        {isMr ? 'AI प्रतवारी सारांश' : 'AI Analysis Verdict'}
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {isMr
                          ? (qualityResult.summary?.mr || "उत्कृष्ट 'अ' दर्जा. सुपरमार्केट आणि मोठ्या खरेदीदारांसाठी योग्य प्रत.")
                          : (qualityResult.summary?.en || 'Premium Grade A Quality. Suitable for high-value supermarket chains.')}
                      </p>
                    </div>
                  </div>

                  {/* Computer Vision Parameter Breakdown */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3">
                    <h4 className="font-bold text-agro-text text-xs uppercase tracking-wider">
                      {isMr ? 'संगणकीय दृष्टी पॅरामीटर तपशील (Parameters):' : 'Computer Vision Parameter Breakdown:'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {qualityResult.features &&
                        Object.entries(qualityResult.features).map(([k, v]: any) => (
                          <div key={k} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                            <span className="text-gray-500 capitalize font-medium">{k}</span>
                            <span className="font-bold text-agro-dark">{String(v)}</span>
                          </div>
                        ))}
                    </div>

                    {/* Detected Defects */}
                    {qualityResult.detectedDefects && qualityResult.detectedDefects.length > 0 && (
                      <div className="pt-2">
                        <div className="text-[11px] font-bold text-gray-400 mb-1.5">
                          {isMr ? 'दोष तपासणी (Defect Inspection):' : 'Defect Inspection:'}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {qualityResult.detectedDefects.map((d: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Disclaimer */}
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p>
                      {isMr
                        ? qualityResult.disclaimer?.mr
                        : qualityResult.disclaimer?.en}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-48 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                  {isMr ? 'तपासणी करण्यासाठी वरील बटणावर क्लिक करा.' : 'Click Scan Sample to run inspection.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MY FPO AGGREGATION INFO & SWITCH WORKFLOW */}
      {activeTab === 'fpo' && (
        <div className="space-y-6">
          {/* Active Joined FPO Main Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agro-light shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-agro-dark text-xs font-bold inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-agro-primary" />
                    <span>{isMr ? 'सध्याची अधिकृत जोडलेली FPO' : 'Currently Joined FPO'}</span>
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-agro-text">
                  {tEntity(joinedFpoName, language)}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {isMr
                    ? 'पुणे कृषी समूह अधिकृत शेतकरी उत्पादक संस्था (FPC) • सर्व शेतमाल एकत्रीकरण व थेट खरेदीदार विक्री'
                    : 'Authorized Pune Cluster Farmer Producer Co. • Bulk aggregation & direct institutional sales'}
                </p>
              </div>

              <button
                onClick={() => {
                  setSwitchSuccessMsg(null);
                  setSwitchErrorMsg(null);
                  setIsSwitchModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-agro-mint border-2 border-agro-primary text-agro-dark hover:bg-agro-primary hover:text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto shrink-0"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>{isMr ? 'FPO संस्था बदला' : 'Switch Joined FPO'}</span>
              </button>
            </div>

            {/* Dynamic FPO Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-2xl bg-agro-bg border border-agro-light">
                <div className="text-xs font-bold text-gray-500 uppercase">{isMr ? 'विश्वासार्हता गुण' : 'Trust Score'}</div>
                <div className="text-3xl font-black text-agro-dark my-1">
                  {joinedFpoId === 'fpo_03' ? '96' : joinedFpoId === 'fpo_02' ? '91' : '94'} / 100
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold">
                  {isMr ? 'सत्यापित NABARD / MSAMB मानांकन' : 'Verified NABARD / MSAMB Rating'}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-agro-bg border border-agro-light">
                <div className="text-xs font-bold text-gray-500 uppercase">{isMr ? 'एकत्रीकरण केंद्र' : 'Aggregation Hub'}</div>
                <div className="text-sm font-bold text-agro-dark my-1">
                  {joinedFpoId === 'fpo_03' 
                    ? (isMr ? 'बारामती एमआयडीसी केंद्र' : 'Baramati MIDC Hub')
                    : joinedFpoId === 'fpo_02'
                    ? (isMr ? 'ओतूर पूर्व केंद्र, जुन्नर' : 'Otur East Hub, Junnar')
                    : (isMr ? 'नारायणगाव शीतगृह केंद्र' : 'Narayangaon Cold Facility')}
                </div>
                <div className="text-[11px] text-gray-500">
                  {joinedFpoId === 'fpo_03'
                    ? (isMr ? '१००० मे.टन बहु-शेतमाल शीतगृह' : '1000 MT Multi-commodity Storage')
                    : (isMr ? '५०० मे.टन कांदा चाळ व हब' : '500 MT Ventilated Chawl')}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-agro-bg border border-agro-light">
                <div className="text-xs font-bold text-gray-500 uppercase">{isMr ? 'पेमेंट व एस्क्रो व्यवस्था' : 'Settlement Mechanism'}</div>
                <div className="text-sm font-bold text-agro-dark my-1">{isMr ? '१००% थेट बँक एस्क्रो' : '100% Escrow Direct'}</div>
                <div className="text-[11px] text-gray-500">{isMr ? '२४ तासांत खात्यावर रक्कम जमा' : 'Direct Bank Deposit within 24 hrs'}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium leading-relaxed">
              💡 <strong>{isMr ? 'FPO मार्फत शेतमाल का विकावा?' : 'Why aggregate through your FPO?'}</strong>{' '}
              {isMr
                ? 'स्थानिक पातळीवर ५० क्विंटलचा अल्प माल व्यापाऱ्यांना पडत्या भावात विकण्याऐवजी FPO मार्फत ५०० क्विंटलचा मोठा लॉट तयार करून सुपरमार्केट्स व निर्यातदारांना ४०% कमी वाहतूक खर्चात उच्च दराने विकला जातो.'
                : 'Instead of selling single 50-quintal lots at distress farm-gate rates, your FPO aggregates up to 500 quintals, securing institutional buyers at premium rates with 40% lower transport costs.'}
            </div>
          </div>

          {/* FPO Transfer / Switch Requests Tracker */}
          {switchRequests.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agro-light shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-agro-primary" />
                  <h3 className="text-lg font-black text-agro-text">
                    {isMr ? 'FPO बदली विनंत्यांचा इतिहास व स्थिती' : 'FPO Switch Requests & Status Tracker'}
                  </h3>
                </div>
                <span className="text-xs font-bold text-gray-500">
                  {switchRequests.length} {isMr ? 'नोंदी' : 'Record(s)'}
                </span>
              </div>

              <div className="space-y-3">
                {switchRequests.map((req: any) => {
                  const isPending = req.status === 'PENDING';
                  const isAccepted = req.status === 'ACCEPTED';
                  const isRejected = req.status === 'REJECTED';

                  return (
                    <div
                      key={req.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isPending
                          ? 'bg-amber-50/70 border-amber-300'
                          : isAccepted
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : isRejected
                          ? 'bg-red-50/70 border-red-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                                isPending
                                  ? 'bg-amber-200 text-amber-900'
                                  : isAccepted
                                  ? 'bg-emerald-200 text-emerald-900'
                                  : isRejected
                                  ? 'bg-red-200 text-red-900'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {isPending
                                ? (isMr ? '⏳ मंजुरी प्रलंबित' : '⏳ Pending Approval')
                                : isAccepted
                                ? (isMr ? '✅ स्वीकृत (FPO बदलली)' : '✅ Accepted (FPO Updated)')
                                : isRejected
                                ? (isMr ? '❌ नाकारले (मूळ FPO कायम)' : '❌ Rejected (FPO Unchanged)')
                                : (isMr ? 'रद्द केले' : 'Cancelled')}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(req.requestedAt || req.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="text-sm font-bold text-agro-dark mt-2">
                            {isMr ? 'लक्षित FPO: ' : 'Target FPO: '}
                            <span className="text-agro-primary">{tEntity(req.targetFpoName, language)}</span>
                          </div>

                          <div className="text-xs text-gray-600 mt-1">
                            <span className="font-semibold">{isMr ? 'कारण / टीप: ' : 'Reason: '}</span>
                            {req.reason}
                          </div>

                          {req.rejectionReason && (
                            <div className="text-xs text-red-700 font-semibold mt-1">
                              {isMr ? 'नाकारण्याचे कारण: ' : 'Rejection Note: '} {req.rejectionReason}
                            </div>
                          )}
                        </div>

                        {isPending && (
                          <button
                            onClick={() => handleCancelRequest(req.id)}
                            className="px-3 py-1.5 rounded-xl bg-white border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors flex items-center gap-1 self-start sm:self-auto"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{isMr ? 'विनंती मागे घ्या' : 'Cancel Request'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: SWITCH FPO */}
      {isSwitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-agro-light shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-agro-mint text-agro-primary">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-agro-text">
                    {isMr ? 'FPO सभासदत्व बदली विनंती' : 'Request FPO Membership Switch'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isMr ? 'पुणे जिल्ह्यातील अधिकृत FPO संस्था निवडा' : 'Select target FPO in Pune District'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSwitchModalOpen(false)}
                className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            {switchSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{switchSuccessMsg}</span>
              </div>
            )}

            {switchErrorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-300 text-red-900 text-xs font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{switchErrorMsg}</span>
              </div>
            )}

            {/* Explanatory Banner */}
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs mb-4 leading-relaxed">
              ℹ️ <strong>{isMr ? 'बदली प्रक्रिया कशी कार्य करते?' : 'How does this workflow work?'}</strong>{' '}
              {isMr
                ? 'आपण विनंती पाठवल्यानंतर निवडलेली FPO तिची मंजुरी देईल. मंजुरी मिळाल्यावरच आपली FPO बदलेल, तोपर्यंत आपली सध्याची FPO सक्रिय राहील.'
                : 'Your transfer request will be sent to the target FPO. Your joined FPO changes only when they accept; otherwise your current FPO remains active.'}
            </div>

            <form onSubmit={handleSwitchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  {isMr ? 'सध्याची जोडलेली FPO' : 'Current Joined FPO'}
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-sm font-bold text-gray-700">
                  {tEntity(joinedFpoName, language)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  {isMr ? 'नवीन लक्षित FPO संस्था निवडा' : 'Select Target FPO to Join'}
                </label>
                <select
                  value={targetFpoId}
                  onChange={e => setTargetFpoId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold bg-white outline-none focus:border-agro-primary"
                >
                  {availableFpos
                    .filter((f: any) => f.id !== joinedFpoId && f.userId !== joinedFpoId)
                    .map((f: any) => (
                      <option key={f.id} value={f.id}>
                        {tEntity(f.name, language)} ({tMandi(f.taluka || f.hubLocation || 'Pune', language)})
                      </option>
                    ))}
                </select>
              </div>

              {/* Target FPO Preview Card */}
              {(() => {
                const targetObj = availableFpos.find(f => f.id === targetFpoId || f.userId === targetFpoId);
                if (!targetObj) return null;
                return (
                  <div className="p-3.5 rounded-2xl bg-agro-bg border border-agro-light text-xs space-y-1.5">
                    <div className="font-extrabold text-agro-dark">
                      🏢 {tEntity(targetObj.name, language)}
                    </div>
                    <div className="text-gray-600">
                      📍 <strong>{isMr ? 'केंद्र:' : 'Hub:'}</strong> {targetObj.hubLocation || targetObj.taluka} • <strong>{isMr ? 'विश्वासार्हता गुण:' : 'Trust Score:'}</strong> {targetObj.trustScore || 92}/100
                    </div>
                    <div className="text-gray-600">
                      📦 <strong>{isMr ? 'साठवणूक व क्षमता:' : 'Facility:'}</strong> {targetObj.storageFacility || 'Standard Cold Hub'} ({targetObj.aggregationCapacity || '400 Q/wk'})
                    </div>
                  </div>
                );
              })()}

              <div>
                <label className="block text-xs font-bold text-agro-text mb-1">
                  {isMr ? 'FPO बदलण्याचे कारण / टीप (पर्यायी)' : 'Reason for Switching (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={switchReason}
                  onChange={e => setSwitchReason(e.target.value)}
                  placeholder={isMr ? 'उदा. ओतूरजवळील शीतगृह केंद्र जवळ आहे किंवा डाळिंब/टोमॅटोसाठी विशेष सुविधा हवे आहे...' : 'e.g. Closer cold hub facility in Junnar taluka...'}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium outline-none focus:border-agro-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsSwitchModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50"
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={switchSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-agro-primary hover:bg-agro-dark text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{switchSubmitting ? (isMr ? 'पाठवत आहे...' : 'Sending...') : (isMr ? 'बदली विनंती पाठवा' : 'Send Switch Request')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-agro-light shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-agro-mint text-agro-primary">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-agro-text">
                  {isMr ? 'नवीन शेतमाल नोंदवा' : 'Add Produce for Aggregation'}
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
                    {isMr ? 'शेतमाल निवडा (कमोडिटी)' : 'Commodity'}
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
                    <option value="Onion">{isMr ? 'कांदा (Onion)' : 'Onion'}</option>
                    <option value="Tomato">{isMr ? 'टोमॅटो (Tomato)' : 'Tomato'}</option>
                    <option value="Pomegranate">{isMr ? 'डाळिंब (Pomegranate)' : 'Pomegranate'}</option>
                    <option value="Grapes">{isMr ? 'द्राक्षे (Grapes)' : 'Grapes'}</option>
                    <option value="Soybean">{isMr ? 'सोयाबीन (Soybean)' : 'Soybean'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">
                    {isMr ? 'अपेक्षित परिमाण (क्विंटल)' : 'Quantity (Quintals)'}
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
                    {isMr ? 'कापणी तारीख' : 'Harvest Date'}
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
                    {isMr ? 'शेत गाव / ठिकाण' : 'Farm Location'}
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
                  {isMr ? 'संबंधित जोडलेली FPO संस्था' : 'Designated Joined FPO (Pune)'}
                </label>
                <select
                  value={assignedFpoId}
                  onChange={e => setAssignedFpoId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white outline-none focus:border-agro-primary"
                >
                  <option value={joinedFpoId}>
                    {tEntity(joinedFpoName, language)} ({isMr ? 'सध्याची जोडलेली FPO' : 'Currently Joined'})
                  </option>
                  {availableFpos
                    .filter((f: any) => f.id !== joinedFpoId && f.userId !== joinedFpoId)
                    .map((f: any) => (
                      <option key={f.id} value={f.id}>
                        {tEntity(f.name, language)}
                      </option>
                    ))}
                </select>
              </div>

              {/* Preliminary AI Quality Scan */}
              <div className="p-3.5 rounded-2xl bg-agro-mint border border-agro-light flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-agro-primary" />
                  <div>
                    <div className="text-xs font-bold text-agro-dark">
                      {isMr ? 'प्राथमिक AI प्रतवारी तपासणी' : 'Run Preliminary AI Quality Scan'}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {isMr ? 'स्वयंचलित प्रतवारी मूल्यमापन (A प्रत, ९२% अचूकता)' : 'Auto-evaluates produce grade (Grade A, 92% Conf.)'}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-agro-primary text-white text-[10px] font-extrabold">
                  {isMr ? 'सक्रिय' : 'Active'}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-2xl bg-agro-primary hover:bg-agro-dark text-white font-bold text-sm shadow-md shadow-agro-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{submitting ? t('common.loading') : (isMr ? 'एकत्रीकरणासाठी FPO कडे दाखल करा' : 'Submit to FPO for Aggregation')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
