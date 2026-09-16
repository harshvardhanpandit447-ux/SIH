import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE } from '../utils/apiConfig';
import {
  tEntity,
  tCrop,
  tMandi,
  tDistrict,
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
  AlertCircle,
  RefreshCw,
  Coins,
  Scale,
  MapPin,
  Zap,
  Award,
  Check,
  Star,
  Filter
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

const MAHARASHTRA_DISTRICTS = [
  'Pune',
  'Nashik',
  'Ahmednagar',
  'Solapur',
  'Satara',
  'Kolhapur',
  'Sangli',
  'Jalgaon',
  'Chhatrapati Sambhaji Nagar',
  'Latur',
  'Nagpur'
];

const COMMODITY_OPTIONS = [
  { key: 'onion', name: 'Onion (कांदा)', category: 'Vegetables', defaultPrice: 2800 },
  { key: 'tomato', name: 'Tomato (टोमॅटो)', category: 'Vegetables', defaultPrice: 2100 },
  { key: 'grapes', name: 'Grapes (द्राक्षे)', category: 'Fruits', defaultPrice: 6500 },
  { key: 'pomegranate', name: 'Pomegranate (डाळिंब)', category: 'Fruits', defaultPrice: 8200 },
  { key: 'soybean', name: 'Soybean (सोयाबीन)', category: 'Field Crops', defaultPrice: 4650 },
  { key: 'cabbage', name: 'Cabbage (कोबी)', category: 'Vegetables', defaultPrice: 1400 },
  { key: 'sugarcane', name: 'Sugarcane (ऊस)', category: 'Commercial', defaultPrice: 3150 }
];

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const defaultDistrict = user?.district || 'Pune';

  const [activeTab, setActiveTab] = useState<'produce' | 'fpoOptimizer' | 'cropMemberships' | 'market' | 'rankings' | 'quality'>('produce');
  const [produces, setProduces] = useState<any[]>([]);

  // Multi-Crop FPO Memberships State
  const [cropMemberships, setCropMemberships] = useState<any[]>([]);
  const [availableFpos, setAvailableFpos] = useState<any[]>([]);
  const [catalogDistrict, setCatalogDistrict] = useState<string>(defaultDistrict);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollCrop, setEnrollCrop] = useState('Onion');
  const [enrollCropCategory, setEnrollCropCategory] = useState('Vegetables');
  const [enrollFpoId, setEnrollFpoId] = useState('fpo_01');
  const [enrollNotes, setEnrollNotes] = useState('');
  const [enrollSubmitting, setEnrollSubmitting] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // FPO Profit Optimizer State
  const [optCrop, setOptCrop] = useState('onion');
  const [optQty, setOptQty] = useState(50);
  const [optStorageDays, setOptStorageDays] = useState(0);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(defaultDistrict);
  const [fpoRankingData, setFpoRankingData] = useState<any>(null);
  const [fpoRankingLoading, setFpoRankingLoading] = useState(false);

  // Form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [commodity, setCommodity] = useState('Onion');
  const [category, setCategory] = useState('Vegetables');
  const [quantity, setQuantity] = useState('');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('Otur, Junnar, Pune');
  const [assignedFpoId, setAssignedFpoId] = useState('fpo_01');
  const [assignedFpoName, setAssignedFpoName] = useState('Shivneri Agri Farmers Producer Co.');
  const estimatedPrice = 2800;
  const [submitting, setSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  // ML Price Prediction State
  const [mlCommodity, setMlCommodity] = useState('onion');
  const [mlHorizon, setMlHorizon] = useState(3);
  const [predictionData, setPredictionData] = useState<any>(null);

  // AI Quality Inspection State
  const [inspectCommodity, setInspectCommodity] = useState('onion');
  const [qualityResult, setQualityResult] = useState<any>(null);
  const [customQualityImage, setCustomQualityImage] = useState<string | null>(null);

  // Multi-Mandi Ranking & Net Realisation State
  const [rankingCrop, setRankingCrop] = useState('Onion');
  const [rankingQty, setRankingQty] = useState(50);
  const [rankingStorageDays, setRankingStorageDays] = useState(0);
  const [rankingData, setRankingData] = useState<any>(null);

  useEffect(() => {
    fetchFarmerData();
    fetchCropMemberships();
    fetchFpoRankings('onion', 50, 0, defaultDistrict);
    fetchPrediction('onion', 3);
    runAiQualityTest('onion');
    fetchRankings('Onion', 50, 0);
  }, []);

  // Sync assigned FPO whenever commodity changes in modal
  useEffect(() => {
    if (cropMemberships.length > 0) {
      const match = cropMemberships.find(m => m.crop.toLowerCase() === commodity.toLowerCase());
      if (match) {
        setAssignedFpoId(match.fpoId);
        setAssignedFpoName(match.fpoName);
      } else {
        const fallback = availableFpos[0];
        if (fallback) {
          setAssignedFpoId(fallback.id);
          setAssignedFpoName(fallback.name);
        }
      }
    }
  }, [commodity, cropMemberships, availableFpos]);

  const fetchCropMemberships = async () => {
    const farmerId = user?.id || 'usr_farmer_01';
    try {
      const res = await fetch(`${API_BASE}/farmer/crop-memberships/${farmerId}`);
      const data = await res.json();
      if (data.success) {
        if (data.memberships) setCropMemberships(data.memberships);
        if (data.availableFpos && data.availableFpos.length > 0) {
          setAvailableFpos(data.availableFpos);
        }
      }
    } catch (err) {
      console.error('Error fetching crop memberships:', err);
    }
  };

  const fetchFpoRankings = async (crop: string, qty: number, days: number, district?: string) => {
    setFpoRankingLoading(true);
    try {
      const village = user?.village || 'Otur';
      const taluka = user?.taluka || 'Junnar';
      const farmerDist = user?.district || 'Pune';
      const filterDist = district !== undefined ? district : selectedDistrict;
      const filterParam = filterDist && filterDist !== 'All' ? `&filterDistrict=${encodeURIComponent(filterDist)}` : '';
      const res = await fetch(`${API_BASE}/ml/rank-fpos?crop=${encodeURIComponent(crop)}&quantity=${qty}&storageDays=${days}&farmerVillage=${encodeURIComponent(village)}&farmerTaluka=${encodeURIComponent(taluka)}&farmerDistrict=${encodeURIComponent(farmerDist)}${filterParam}`);
      const data = await res.json();
      if (data.success) {
        setFpoRankingData(data);
      }
    } catch (err) {
      console.error('Error fetching FPO profit rankings:', err);
    } finally {
      setFpoRankingLoading(false);
    }
  };

  const handleCropEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollSubmitting(true);
    setEnrollMsg(null);

    const targetFpo = availableFpos.find(f => f.id === enrollFpoId || f.userId === enrollFpoId);
    const targetName = targetFpo?.name || 'Designated FPC';

    try {
      const res = await fetch(`${API_BASE}/farmer/crop-memberships/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: user?.id || 'usr_farmer_01',
          farmerName: user?.name || 'Sopanrao Patil',
          crop: enrollCrop,
          cropCategory: enrollCropCategory,
          fpoId: enrollFpoId,
          fpoName: targetName,
          notes: enrollNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        setEnrollMsg({
          type: 'success',
          text: isMr
            ? `✅ ${tCrop(enrollCrop, language)} पिकासाठी ${tEntity(targetName, language)} सोबत सभासदत्व यशस्वीरित्या जोडले गेले!`
            : `✅ Successfully enrolled ${enrollCrop} membership with ${targetName}!`
        });
        fetchCropMemberships();
        setTimeout(() => {
          setIsEnrollModalOpen(false);
          setEnrollMsg(null);
        }, 2000);
      } else {
        setEnrollMsg({ type: 'error', text: data.error || 'Failed to enroll crop membership' });
      }
    } catch (err) {
      setEnrollMsg({ type: 'error', text: 'Network error. Could not reach server.' });
    } finally {
      setEnrollSubmitting(false);
    }
  };

  const handleLeaveCropMembership = async (membershipId: string) => {
    if (!window.confirm(isMr ? 'आपण हे पीक सभासदत्व रद्द करू इच्छिता?' : 'Are you sure you want to remove this crop membership?')) return;
    try {
      const res = await fetch(`${API_BASE}/farmer/crop-memberships/${membershipId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCropMemberships();
      }
    } catch (err) {
      console.error('Error removing membership:', err);
    }
  };

  const fetchRankings = async (crop: string, qty: number, days: number) => {
    try {
      const res = await fetch(`${API_BASE}/market/rankings?crop=${crop}&quantity=${qty}&storageDays=${days}`);
      const data = await res.json();
      if (data.success) {
        setRankingData(data);
      }
    } catch (err) {
      console.error('Error fetching mandi rankings:', err);
    }
  };

  const fetchFarmerData = async () => {
    try {
      const res = await fetch(`${API_BASE}/farmer/dashboard/usr_farmer_01`);
      const data = await res.json();
      if (data.produces) setProduces(data.produces);
    } catch (err) {
      console.error('Error loading farmer data:', err);
    }
  };

  const fetchPrediction = async (crop: string, horizon: number) => {
    try {
      const res = await fetch(`${API_BASE}/ml/predict-future-price?commodity=${encodeURIComponent(crop)}&horizonWeeks=${horizon}`);
      const data = await res.json();
      if (data && (data.success || data.predictedRange || data.predictedDisplay)) {
        setPredictionData(data);
      }
    } catch (err) {
      console.error('Error fetching ML prediction:', err);
    }
  };

  const runAiQualityTest = async (crop: string, customImg?: string) => {
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
    }
  };

  const handleAddProduceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalSuccess(null);

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
          assignedFpoName,
          qualityGrade: 'Grade A',
          qualityConfidence: 92,
          photoUrl: CROP_SAMPLE_IMAGES[commodity.toLowerCase()] || CROP_SAMPLE_IMAGES.onion,
          estimatedPrice
        })
      });

      const data = await res.json();
      if (data.success) {
        setModalSuccess(
          isMr
            ? `✅ शेतमाल यशस्वीरित्या नोंदवला गेला! आपल्या अधिकृत FPO (${tEntity(assignedFpoName, language)}) कडे एकत्रीकरणासाठी पाठवला आहे.`
            : `✅ Produce submitted successfully to ${assignedFpoName} for aggregation!`
        );
        fetchFarmerData();
        setTimeout(() => {
          setIsAddModalOpen(false);
          setModalSuccess(null);
          setQuantity('');
        }, 2200);
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCustomQualityImage(result);
        runAiQualityTest(inspectCommodity, result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Farmer Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/40 mb-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isMr ? 'शेतकरी पोर्टल • पुणे क्लस्टर' : 'Farmer Dashboard • Pune Cluster'}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
                {cropMemberships.length} {isMr ? 'पीक सभासदत्व जोडले' : 'Crop FPOs Active'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {isMr ? 'स्वागत आहे,' : 'Welcome back,'} {tEntity(user?.name || 'Sopanrao Patil', language)}
            </h1>
            <p className="text-sm text-emerald-200 mt-1 max-w-2xl">
              {isMr
                ? 'विविध पिकांनुसार योग्य FPO निवडा, खर्च व वाहतूक वजा जाता सर्वाधिक प्रत्यक्ष नफा मिळवा आणि थेट बँक खात्यात पैसे मिळवा.'
                : 'Connect to specialized FPOs for each crop, maximize actual net profit after transport & storage, and track aggregation.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-agro-primary hover:bg-agro-bright text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{isMr ? '+ शेतमाल जोडा' : '+ Add Produce'}</span>
            </button>
            <button
              onClick={() => setActiveTab('fpoOptimizer')}
              className="px-4 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 font-bold text-sm transition-colors flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isMr ? 'नफा अनुकूलक' : 'FPO Profit Optimizer'}</span>
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
            {isMr ? 'FPO निव्वळ परतावा फायदा' : 'FPO Net Advantage'}
          </div>
          <div className="text-2xl font-black text-agro-primary">
            +₹320 – ₹450 <span className="text-xs font-semibold text-gray-400">/ {isMr ? 'क्विंटल' : 'q'}</span>
          </div>
          <div className="text-xs text-blue-600 font-bold mt-1">
            {isMr ? 'कमी वाहतूक व थेट खरेदीदार' : 'Higher than APMC Mandi'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {isMr ? 'सक्रिय पीक सभासदत्व' : 'Active Crop FPOs'}
          </div>
          <div className="text-2xl font-black text-emerald-800">
            {cropMemberships.length} <span className="text-xs font-semibold text-gray-400">{isMr ? 'पिके नोंदणीकृत' : 'Crops Enrolled'}</span>
          </div>
          <div className="text-xs text-gray-500 font-medium mt-1">
            {isMr ? 'कांदा, टोमॅटो, सोयाबीन' : 'Onion, Tomato, Soybean'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {isMr ? 'माझी प्राथमिक FPO संस्था' : 'Primary FPO'}
          </div>
          <div className="text-lg font-bold text-agro-dark truncate">
            {tEntity(cropMemberships[0]?.fpoName || 'Shivneri Agri FPC', language)}
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
          { id: 'fpoOptimizer', label: isMr ? '🚀 FPO नफा अनुकूलक (Highest Profit)' : '🚀 FPO Profit Optimizer', icon: Zap },
          { id: 'cropMemberships', label: isMr ? '🏢 बहु-पीक FPO सभासदत्व' : '🏢 Multi-Crop FPO Memberships', icon: Building2 },
          { id: 'market', label: isMr ? 'ML दर अंदाज' : 'ML Price Prediction', icon: TrendingUp },
          { id: 'rankings', label: isMr ? 'बाजारपेठ रँकिंग (Net ₹)' : 'Mandi Rankings', icon: Scale },
          { id: 'quality', label: isMr ? 'AI प्रतवारी' : 'AI Quality Scan', icon: Sparkles }
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
                className="px-5 py-2.5 rounded-xl bg-agro-primary text-white font-bold text-xs shadow"
              >
                {isMr ? '+ शेतमाल जोडा' : '+ Submit Produce'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {produces.map(p => (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl p-5 border border-agro-light shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.photoUrl || CROP_SAMPLE_IMAGES[p.commodity.toLowerCase()] || CROP_SAMPLE_IMAGES.onion}
                        alt={p.commodity}
                        className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-inner"
                      />
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-agro-mint text-agro-dark">
                          {p.category || 'Vegetables'}
                        </span>
                        <h3 className="text-base font-black text-agro-dark mt-1">
                          {tCrop(p.commodity, language)}
                        </h3>
                        <p className="text-xs text-gray-500 font-semibold">
                          {p.quantity} {p.unit || 'Quintal'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                        p.status === 'AGGREGATED'
                          ? 'bg-blue-100 text-blue-800'
                          : p.status === 'SOLD'
                          ? 'bg-purple-100 text-purple-800'
                          : p.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tStatus(p.status, language)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-agro-bg space-y-1.5 text-xs text-gray-600 my-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isMr ? 'जोडलेली FPO:' : 'Assigned FPO:'}</span>
                      <span className="font-bold text-agro-dark truncate max-w-[150px]">
                        {tEntity(p.assignedFpoName || 'Shivneri FPC', language)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isMr ? 'गुणवत्ता प्रत:' : 'Quality Grade:'}</span>
                      <span className="font-bold text-emerald-700">
                        {tGrade(p.qualityGrade || 'Grade A', language)} ({p.qualityConfidence || 92}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isMr ? 'कापणी तारीख:' : 'Harvest Date:'}</span>
                      <span className="font-semibold">{p.harvestDate}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-gray-200/60 font-bold text-agro-dark">
                      <span>{isMr ? 'अपेक्षित निव्वळ परतावा:' : 'Est. Net Return:'}</span>
                      <span className="text-emerald-700">
                        ₹{p.estimatedNetRealisation ? (p.estimatedNetRealisation * p.quantity).toLocaleString('en-IN') : '1,28,000'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {p.location || 'Pune, MH'}
                    </span>
                    <span className="text-[11px]">
                      {p.lotId ? `${isMr ? 'लॉट:' : 'Lot:'} ${p.lotId}` : (isMr ? 'एकत्रीकरण चालू' : 'Pending Lot')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FPO PROFIT OPTIMIZER (TOP NET PROFIT TO FARMER ON TOP) */}
      {activeTab === 'fpoOptimizer' && (
        <div className="space-y-6">
          {/* Hero Explainer */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-900 to-emerald-950 text-white border border-teal-800 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>{isMr ? 'AI नफा अनुकूलक • खर्च वजा प्रत्यक्ष नफा' : 'AI Profit Maximizer • Net Realisation'}</span>
                </span>
                <h2 className="text-2xl font-black">
                  {isMr ? 'कोणती FPO देते सर्वाधिक निव्वळ नफा?' : 'Which FPO Gives You the Highest Net Return?'}
                </h2>
                <p className="text-xs text-emerald-200 mt-1 max-w-2xl leading-relaxed">
                  {isMr
                    ? 'वाहतूक खर्च (अंतर km), साठवणूक फी (शीतगृह/चाळ), FPO व्यवस्थापन आकार आणि घट/सड बचत यांचा सूक्ष्म हिशोब करून सर्वाधिक निव्वळ नफा देणारी FPO सर्वात वर दाखवली आहे.'
                    : 'Ranks FPOs by actual net realization in your hands after deducting logistics freight, storage rent, and FPO fees while adding spoilage mitigation value.'}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl border border-white/10 shrink-0">
                <Coins className="w-8 h-8 text-amber-300" />
                <div>
                  <div className="text-[11px] text-emerald-200">{isMr ? 'शेतकरी स्थान' : 'Farmer Location'}</div>
                  <div className="text-sm font-black text-white">{user?.village || 'Otur'}, {user?.taluka || 'Junnar'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Optimizer Controls with Maharashtra District Selector */}
          <div className="p-6 bg-white rounded-3xl border border-agro-light shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                {isMr ? 'आपल्या शेतमालाचा व जिल्ह्याचा तपशील निवडा' : 'Configure Your Produce & District Parameters'}
              </h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {isMr ? `डिफॉल्ट जिल्हा: ${tDistrict(defaultDistrict, language)}` : `Default District: ${defaultDistrict}`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-agro-primary" />
                  <span>{isMr ? 'जिल्हा निवडा (Default)' : 'Select District'}</span>
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    const dist = e.target.value;
                    setSelectedDistrict(dist);
                    fetchFpoRankings(optCrop, optQty, optStorageDays, dist);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark bg-gray-50 focus:bg-white"
                >
                  <option value="All">{isMr ? 'सर्व जिल्हे (All Maharashtra)' : 'All Districts (Maharashtra)'}</option>
                  {MAHARASHTRA_DISTRICTS.map(d => (
                    <option key={d} value={d}>
                      {tDistrict(d, language)} {d === defaultDistrict ? (isMr ? '★ (माझा जिल्हा)' : '★ (My District)') : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isMr ? 'शेतमाल / पीक' : 'Commodity / Crop'}</label>
                <select
                  value={optCrop}
                  onChange={(e) => {
                    setOptCrop(e.target.value);
                    fetchFpoRankings(e.target.value, optQty, optStorageDays, selectedDistrict);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark bg-gray-50 focus:bg-white"
                >
                  {COMMODITY_OPTIONS.map(c => (
                    <option key={c.key} value={c.key}>{tCrop(c.name, language)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isMr ? 'अपेक्षित आवक (क्विंटल)' : 'Expected Quantity'}: <span className="text-agro-primary font-black">{optQty} Q</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={optQty}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setOptQty(val);
                    fetchFpoRankings(optCrop, val, optStorageDays, selectedDistrict);
                  }}
                  className="w-full accent-agro-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isMr ? 'साठवणूक कालावधी' : 'Storage Holding'}: <span className="text-agro-primary font-black">{optStorageDays} {isMr ? 'दिवस' : 'Days'}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={optStorageDays}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setOptStorageDays(val);
                    fetchFpoRankings(optCrop, optQty, val, selectedDistrict);
                  }}
                  className="w-full accent-agro-primary"
                />
              </div>
            </div>
          </div>

          {/* Benchmark vs APMC Mandi Distress Bar */}
          {fpoRankingData?.apmcBenchmark && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>{isMr ? 'स्थानिक APMC आडते विक्री आधार:' : 'Local APMC Spot Distress Baseline:'}</strong>{' '}
                  {isMr
                    ? `स्थानिक बाजारात थेट विकल्यास सर्व आडत व भाडे वजा जाता हाती मिळतात: ₹${fpoRankingData.apmcBenchmark.netPerQtl}/क्विंटल (एकूण: ₹${fpoRankingData.apmcBenchmark.totalNet.toLocaleString('en-IN')})`
                    : `Selling individually at local APMC yields net ₹${fpoRankingData.apmcBenchmark.netPerQtl}/q (Total batch: ₹${fpoRankingData.apmcBenchmark.totalNet.toLocaleString('en-IN')})`}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-950 font-bold shrink-0">
                {isMr ? 'APMC तुलनेत अधिक नफा' : 'FPO Value Comparison'}
              </span>
            </div>
          )}

          {/* Ranked FPO Cards List */}
          {fpoRankingLoading ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-agro-light">
              <RefreshCw className="w-8 h-8 text-agro-primary animate-spin mx-auto mb-2" />
              <div className="text-sm font-bold text-gray-600">{isMr ? 'सर्वात फायदेशीर FPO शोधत आहे...' : 'Calculating highest profit FPOs...'}</div>
            </div>
          ) : fpoRankingData?.rankedFpos ? (
            <div className="space-y-4">
              {fpoRankingData.rankedFpos.map((fpo: any, idx: number) => {
                const isTop = idx === 0;
                const isEnrolled = cropMemberships.some(
                  m => (m.fpoId === fpo.fpoId || m.fpoId === fpo.userId) && m.crop.toLowerCase() === optCrop.toLowerCase()
                );

                return (
                  <div
                    key={fpo.fpoId}
                    className={`p-6 rounded-3xl border transition-all ${
                      isTop
                        ? 'bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-2 border-emerald-500 shadow-lg relative overflow-hidden'
                        : 'bg-white border-agro-light shadow-sm hover:border-gray-300'
                    }`}
                  >
                    {isTop && (
                      <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{isMr ? '🌟 सर्वाधिक निव्वळ नफा (शिफारस)' : '🌟 Highest Net Profit (Top Pick)'}</span>
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${isTop ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                            #{fpo.rank}
                          </span>
                          <h3 className="text-lg sm:text-xl font-black text-agro-text">
                            {tEntity(fpo.name, language)}
                          </h3>
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200">
                            📍 {tDistrict(fpo.district, language)}
                          </span>
                          {fpo.supportsCrop && (
                            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">
                              ✓ {isMr ? 'या पिकासाठी तज्ज्ञ' : 'Crop Specialist'}
                            </span>
                          )}
                          {isEnrolled && (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                              ✓ {isMr ? 'आपले सभासदत्व सक्रिय' : 'Active Member'}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-semibold text-gray-700">
                            <MapPin className="w-3.5 h-3.5 text-agro-primary" />
                            {fpo.hubLocation} ({fpo.distanceKm} km {isMr ? 'अंतर' : 'away'})
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-800">
                            🏢 {fpo.storageFacility}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-agro-dark">
                            ⭐ {fpo.trustScore}/100 {isMr ? 'विश्वासार्हता' : 'Trust'}
                          </span>
                        </div>

                        {isTop && fpo.recommendationReason && (
                          <div className="p-3 rounded-2xl bg-emerald-100/70 border border-emerald-300 text-xs text-emerald-950 font-medium">
                            {isMr ? fpo.recommendationReason.mr : fpo.recommendationReason.en}
                          </div>
                        )}

                        {/* Cost Breakdown Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                          <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                            <span className="text-gray-400 block">{isMr ? 'FPO घाऊक दर' : 'FPO Gross Rate'}</span>
                            <span className="font-bold text-agro-dark">₹{fpo.pricing.fpoGrossPrice}/q</span>
                          </div>
                          <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                            <span className="text-gray-400 block">{isMr ? 'वाहतूक खर्च' : 'Transport Cost'}</span>
                            <span className="font-bold text-red-700">-₹{fpo.pricing.transportCostPerQtl}/q</span>
                          </div>
                          <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                            <span className="text-gray-400 block">{isMr ? 'FPO फी / साठवण' : 'FPO Fee & Storage'}</span>
                            <span className="font-bold text-red-700">-₹{fpo.pricing.fpoFeePerQtl + fpo.pricing.storageCostPerQtl}/q</span>
                          </div>
                          <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200">
                            <span className="text-emerald-600 block">{isMr ? 'सड/वजन घट बचत' : 'Spoilage Saved'}</span>
                            <span className="font-bold text-emerald-800">+₹{fpo.pricing.spoilageSavingsPerQtl}/q</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Payout Box & CTA */}
                      <div className="flex flex-col items-start lg:items-end justify-between gap-4 p-4 rounded-2xl bg-white border border-gray-100 lg:min-w-[240px] shadow-sm">
                        <div>
                          <div className="text-[11px] font-bold text-gray-400 uppercase">{isMr ? 'शेतकऱ्याचा निव्वळ दर' : 'Net Farmer Realisation'}</div>
                          <div className="text-2xl font-black text-emerald-800">
                            ₹{fpo.pricing.netRealisationPerQtl} <span className="text-xs font-semibold text-gray-400">/ {isMr ? 'क्विंटल' : 'q'}</span>
                          </div>
                          <div className="text-xs font-black text-emerald-600 mt-0.5">
                            {isMr ? 'एकूण लॉट प्राप्ती:' : 'Total Net Payout:'} ₹{fpo.pricing.totalNetRealisation.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] font-bold text-blue-700 mt-1">
                            +₹{fpo.pricing.extraProfitTotal.toLocaleString('en-IN')} ({fpo.pricing.extraProfitPct}%) {isMr ? 'APMC पेक्षा जादा' : 'more than APMC'}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full">
                          {!isEnrolled ? (
                            <button
                              onClick={() => {
                                setEnrollCrop(optCrop.charAt(0).toUpperCase() + optCrop.slice(1));
                                setEnrollFpoId(fpo.fpoId);
                                setIsEnrollModalOpen(true);
                              }}
                              className="w-full px-4 py-2.5 rounded-xl bg-agro-primary hover:bg-agro-bright text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{isMr ? 'या FPO मध्ये जोडा' : 'Enroll with this FPO'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setCommodity(optCrop.charAt(0).toUpperCase() + optCrop.slice(1));
                                setAssignedFpoId(fpo.fpoId);
                                setAssignedFpoName(fpo.name);
                                setIsAddModalOpen(true);
                              }}
                              className="w-full px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow"
                            >
                              <PlusCircle className="w-4 h-4" />
                              <span>{isMr ? 'शेतमाल लॉट दाखल करा' : 'Submit Produce Lot'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 3: MULTI-CROP FPO MEMBERSHIPS & CATALOG */}
      {activeTab === 'cropMemberships' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-agro-text">
                {isMr ? 'माझी पीकनिहाय FPO सभासदत्वे' : 'My Multi-Crop FPO Memberships'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {isMr
                  ? 'शेतकरी वेगवेगळ्या पिकांसाठी स्वतंत्र तज्ज्ञ FPO शी जोडू शकतात (उदा. कांद्यासाठी एक, टोमॅटो/द्राक्षासाठी दुसरी).'
                  : 'You can maintain separate FPO partnerships per crop category based on storage & market specialization.'}
              </p>
            </div>

            <button
              onClick={() => {
                setEnrollMsg(null);
                setIsEnrollModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-agro-primary hover:bg-agro-bright text-white text-xs font-bold transition-all flex items-center gap-2 shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isMr ? '+ नवीन पीक FPO जोडा' : '+ Enroll Crop with FPO'}</span>
            </button>
          </div>

          {/* Active Memberships Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cropMemberships.map(cm => (
              <div key={cm.id} className="p-5 rounded-3xl bg-white border border-agro-light shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                      {tCrop(cm.crop, language)}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(cm.enrolledDate || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-agro-dark">
                    {tEntity(cm.fpoName, language)}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{cm.notes || 'Enrolled for aggregation'}</p>
                </div>

                <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {isMr ? 'सक्रिय सभासद' : 'Active Member'}
                  </span>
                  <button
                    onClick={() => handleLeaveCropMembership(cm.id)}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold"
                  >
                    {isMr ? 'रद्द करा' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Verified FPOs Capability & Services Catalog with District Filter */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agro-light shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-black text-agro-text">
                  {isMr
                    ? `${tDistrict(catalogDistrict, language)} जिल्ह्यातील अधिकृत FPO संस्था व सेवा`
                    : `Verified FPOs Directory • ${catalogDistrict === 'All' ? 'All Districts' : `${tDistrict(catalogDistrict, language)} District`}`}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isMr
                    ? 'आपल्या जिल्ह्यानुसार किंवा इतर जिल्ह्यातील विशेष शीतगृह व निर्यात सुविधा असलेल्या FPO तपासा.'
                    : 'Browse verified FPCs by Maharashtra district to view specialized crop storage and capabilities.'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
                <Filter className="w-3.5 h-3.5 text-agro-primary" />
                <span>{isMr ? 'जिल्हा निवडा:' : 'Filter District:'}</span>
              </div>
            </div>

            {/* District Filter Pill Buttons */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-3 mb-6 border-b border-gray-100">
              <button
                onClick={() => setCatalogDistrict('All')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  catalogDistrict === 'All'
                    ? 'bg-agro-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isMr ? 'सर्व जिल्हे' : 'All Districts'}
              </button>
              {MAHARASHTRA_DISTRICTS.map(d => {
                const isDefault = d === defaultDistrict;
                const isActive = catalogDistrict === d;
                return (
                  <button
                    key={d}
                    onClick={() => setCatalogDistrict(d)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                      isActive
                        ? 'bg-agro-primary text-white shadow-sm'
                        : isDefault
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{tDistrict(d, language)}</span>
                    {isDefault && <span className="text-[10px] opacity-80">{isMr ? '(माझा)' : '(Default)'}</span>}
                  </button>
                );
              })}
            </div>

            {/* FPO Cards Grid */}
            {(() => {
              const filteredCatalogFpos = catalogDistrict === 'All'
                ? availableFpos
                : availableFpos.filter(f => (f.district || 'Pune').toLowerCase() === catalogDistrict.toLowerCase());

              if (filteredCatalogFpos.length === 0) {
                return (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-200">
                    <Building2 className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <div className="font-bold text-gray-700 text-sm">
                      {isMr
                        ? `${tDistrict(catalogDistrict, language)} जिल्ह्यात सध्या नवीन FPO नोंदणी प्रक्रिया सुरू आहे.`
                        : `No FPCs currently listed in ${catalogDistrict} District.`}
                    </div>
                    <button
                      onClick={() => setCatalogDistrict('All')}
                      className="mt-3 px-4 py-1.5 rounded-xl bg-agro-primary text-white text-xs font-bold"
                    >
                      {isMr ? 'सर्व जिल्हे दाखवा' : 'Show All Districts'}
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCatalogFpos.map(fpo => (
                    <div key={fpo.id} className="p-5 rounded-2xl bg-agro-bg border border-agro-light flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-black text-agro-dark">{tEntity(fpo.name, language)}</h4>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            {fpo.trustScore || 90}/100 ⭐
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-black uppercase">
                            📍 {tDistrict(fpo.district || 'Pune', language)}
                          </span>
                          <span className="text-xs text-gray-600 flex items-center gap-1 font-semibold truncate">
                            <MapPin className="w-3.5 h-3.5 text-agro-primary shrink-0" />
                            {fpo.hubLocation || `${fpo.taluka}, ${fpo.district}`}
                          </span>
                        </div>

                        <div className="text-xs text-gray-700">
                          <span className="font-bold">{isMr ? 'साठवणूक सोय:' : 'Storage Facility:'} </span>
                          {fpo.storageFacility || 'Standard Aggregation Hub'}
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-gray-500 block mb-1">
                            {isMr ? 'साठवणूक व विक्री पिके:' : 'Handled Produce Types:'}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {(fpo.products || ['Onion', 'Tomato', 'Vegetables']).map((prod: string) => (
                              <span key={prod} className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-xs font-semibold text-agro-dark">
                                {tCrop(prod, language)}
                              </span>
                            ))}
                          </div>
                        </div>

                        {fpo.services && (
                          <div>
                            <span className="text-[11px] font-bold text-gray-500 block mb-1">
                              {isMr ? 'विशेष सेवा:' : 'Key Capabilities:'}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {fpo.services.map((s: string) => (
                                <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 text-[10px] font-bold">
                                  ✓ {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 mt-3 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-[11px] text-gray-500">
                          {isMr ? 'FPO आकार:' : 'FPO Handling Fee:'} {fpo.fpoFeesPct || 2.0}%
                        </span>
                        <button
                          onClick={() => {
                            setEnrollFpoId(fpo.id);
                            setIsEnrollModalOpen(true);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-agro-primary text-white text-xs font-bold hover:bg-agro-bright transition-all"
                        >
                          {isMr ? 'पीक जोडा' : 'Enroll Crop'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 4: ML PRICE PREDICTION & MANDI FORECAST */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-agro-light shadow-sm">
            <h2 className="text-xl font-black text-agro-text mb-4">
              {isMr ? 'कृषी भाव अंदाज व साठवणूक विश्लेषण' : 'Crop Price Trend & Storage Optimization Engine'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isMr ? 'शेतमाल निवडा' : 'Select Commodity'}</label>
                <select
                  value={mlCommodity}
                  onChange={(e) => {
                    setMlCommodity(e.target.value);
                    fetchPrediction(e.target.value, mlHorizon);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark bg-gray-50"
                >
                  {COMMODITY_OPTIONS.map(c => (
                    <option key={c.key} value={c.key}>{tCrop(c.name, language)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isMr ? 'अंदाज कालावधी (आठवडे)' : 'Forecast Horizon (Weeks)'}</label>
                <select
                  value={mlHorizon}
                  onChange={(e) => {
                    const h = Number(e.target.value);
                    setMlHorizon(h);
                    fetchPrediction(mlCommodity, h);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark bg-gray-50"
                >
                  <option value={1}>1 {isMr ? 'आठवडा' : 'Week'}</option>
                  <option value={2}>2 {isMr ? 'आठवडे' : 'Weeks'}</option>
                  <option value={3}>3 {isMr ? 'आठवडे' : 'Weeks'}</option>
                  <option value={4}>4 {isMr ? 'आठवडे' : 'Weeks'}</option>
                </select>
              </div>
            </div>

            {predictionData && (
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase">{isMr ? 'अंदाजित भाव कक्षा' : 'Predicted Modal Range'}</span>
                    <div className="text-3xl font-black text-agro-dark my-1">
                      {predictionData.predictedDisplay || `₹${predictionData.predictedRange?.min} – ₹${predictionData.predictedRange?.max}`}
                    </div>
                    <span className="text-xs font-bold text-emerald-700">
                      {predictionData.confidenceScore || 85}% {isMr ? 'अचूकता' : 'Confidence'} • {predictionData.trendDirection}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-emerald-100 text-xs text-agro-dark font-medium max-w-md">
                    <strong>{isMr ? 'AI सल्ला:' : 'AI Recommendation:'} </strong>
                    {isMr ? predictionData.recommendationText?.mr : predictionData.recommendationText?.en}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: MANDI RANKINGS */}
      {activeTab === 'rankings' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-agro-light shadow-sm">
            <h2 className="text-xl font-black text-agro-text mb-4">
              {isMr ? 'APMC बाजारपेठ निव्वळ प्राप्ती रँकिंग' : 'APMC Mandi True Net Realisation Ranking'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isMr ? 'शेतमाल' : 'Crop'}</label>
                <select
                  value={rankingCrop}
                  onChange={(e) => {
                    setRankingCrop(e.target.value);
                    fetchRankings(e.target.value, rankingQty, rankingStorageDays);
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark"
                >
                  {COMMODITY_OPTIONS.map(c => (
                    <option key={c.key} value={c.name}>{tCrop(c.name, language)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isMr ? 'आवक (क्विंटल)' : 'Quantity (Q)'}</label>
                <input
                  type="number"
                  value={rankingQty}
                  onChange={(e) => {
                    const q = Number(e.target.value);
                    setRankingQty(q);
                    fetchRankings(rankingCrop, q, rankingStorageDays);
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isMr ? 'साठवणूक दिवस' : 'Storage Days'}</label>
                <input
                  type="number"
                  value={rankingStorageDays}
                  onChange={(e) => {
                    const d = Number(e.target.value);
                    setRankingStorageDays(d);
                    fetchRankings(rankingCrop, rankingQty, d);
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark"
                />
              </div>
            </div>

            {rankingData?.rankedMandis && (
              <div className="space-y-3">
                {rankingData.rankedMandis.map((m: any, idx: number) => (
                  <div
                    key={m.mandi}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      idx === 0 ? 'bg-emerald-50/70 border-emerald-400' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-agro-dark">{m.rank}. {tMandi(m.mandi, language)}</span>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                            {isMr ? 'सर्वोत्तम निव्वळ भाव' : 'Best Net Mandi'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {m.distanceKm} km • {isMr ? 'वाहतूक खर्च:' : 'Freight:'} ₹{m.transportCost}/q • {isMr ? 'आडत/सेस:' : 'Cess:'} ₹{m.marketCess}/q
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-800">₹{m.netRealisation}/q</div>
                      <div className="text-xs font-bold text-gray-500">{isMr ? 'एकूण:' : 'Total:'} ₹{m.totalLotRevenue.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: AI QUALITY GRADING */}
      {activeTab === 'quality' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-agro-light shadow-sm">
            <h2 className="text-xl font-black text-agro-text mb-2">
              {isMr ? 'संगणकीय दृष्टी (AI) शेतमाल प्रतवारी व दोष शोध' : 'AI Computer Vision Quality Grading'}
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              {isMr
                ? 'शेतमालाचा फोटो स्कॅन करून थेट आकारमान, रंग, चकाकी आणि डागांची तपासणी करा.'
                : 'Upload or analyze a harvest image to assess size uniformity, skin integrity, and quality grade.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isMr ? 'शेतमाल निवडा' : 'Select Produce'}</label>
                <select
                  value={inspectCommodity}
                  onChange={(e) => {
                    setInspectCommodity(e.target.value);
                    setCustomQualityImage(null);
                    runAiQualityTest(e.target.value);
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark"
                >
                  {COMMODITY_OPTIONS.map(c => (
                    <option key={c.key} value={c.key}>{tCrop(c.name, language)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isMr ? 'स्वतःचा फोटो अपलोड करा' : 'Upload Harvest Photo'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-agro-mint file:text-agro-dark"
                />
              </div>
            </div>

            {qualityResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <img
                    src={customQualityImage || CROP_SAMPLE_IMAGES[inspectCommodity.toLowerCase()] || CROP_SAMPLE_IMAGES.onion}
                    alt="Inspection"
                    className="w-full h-56 object-cover rounded-2xl border border-gray-200 shadow-sm mb-3"
                  />
                  <div className="text-xs text-center font-bold text-gray-500">
                    {isMr ? 'संगणकीय विश्लेषण प्रतिमा' : 'Vision Analysis Specimen'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase">{isMr ? 'प्रतवारी दर्जा' : 'Assessed Grade'}</span>
                      <div className="text-2xl font-black text-emerald-700">{qualityResult.grade}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {qualityResult.confidence}% {isMr ? 'अचूकता' : 'Confidence'}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-gray-700 leading-relaxed">
                    <strong>{isMr ? 'AI निष्कर्ष:' : 'Summary:'} </strong>
                    {isMr ? qualityResult.summary?.mr : qualityResult.summary?.en}
                  </div>

                  {qualityResult.features && (
                    <div className="space-y-1 text-xs text-gray-600">
                      {Object.entries(qualityResult.features).map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1 border-b border-gray-100">
                          <span className="capitalize text-gray-400">{k.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-semibold text-agro-dark">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-agro-light shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-agro-dark">
                {isMr ? '+ शेतमाल दाखल करा' : '+ Submit Produce for Aggregation'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            {modalSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 font-bold mb-4">
                {modalSuccess}
              </div>
            )}

            <form onSubmit={handleAddProduceSubmit} className="space-y-4 text-xs font-bold text-gray-700">
              <div>
                <label className="block mb-1">{isMr ? 'पीक / शेतमाल' : 'Commodity'}</label>
                <select
                  value={commodity}
                  onChange={(e) => {
                    const c = e.target.value;
                    setCommodity(c);
                    const opt = COMMODITY_OPTIONS.find(o => o.key === c.toLowerCase());
                    if (opt) setCategory(opt.category);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark bg-gray-50"
                >
                  {COMMODITY_OPTIONS.map(c => (
                    <option key={c.key} value={c.name.split(' ')[0]}>{tCrop(c.name, language)}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">{isMr ? 'प्रमाण (क्विंटल)' : 'Quantity (Quintals)'}</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark"
                  />
                </div>
                <div>
                  <label className="block mb-1">{isMr ? 'कापणी तारीख' : 'Harvest Date'}</label>
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">{isMr ? 'शेतमाल स्थान / गाव' : 'Location'}</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark"
                />
              </div>

              <div>
                <label className="block mb-1">
                  {isMr ? 'एकत्रीकरण करणारी FPO संस्था' : 'Designated FPO for this Crop'}
                </label>
                <select
                  value={assignedFpoId}
                  onChange={(e) => {
                    setAssignedFpoId(e.target.value);
                    const sel = availableFpos.find(f => f.id === e.target.value || f.userId === e.target.value);
                    if (sel) setAssignedFpoName(sel.name);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark bg-gray-50"
                >
                  {availableFpos.map(f => (
                    <option key={f.id} value={f.id}>
                      [{tDistrict(f.district || 'Pune', language)}] {tEntity(f.name, language)} ({f.storageFacility || 'Hub'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-2xl bg-agro-primary hover:bg-agro-bright text-white text-sm font-bold transition-all shadow"
                >
                  {submitting ? (isMr ? 'नोंदणी चालू...' : 'Submitting...') : (isMr ? 'FPO कडे दाखल करा' : 'Submit Produce to FPO')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ENROLL CROP MEMBERSHIP */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-agro-light shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-agro-dark">
                {isMr ? 'पीकनिहाय FPO सभासदत्व नोंदणी' : 'Enroll Crop with Specialized FPO'}
              </h3>
              <button onClick={() => setIsEnrollModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            {enrollMsg && (
              <div className={`p-4 rounded-2xl text-xs font-bold mb-4 ${enrollMsg.type === 'success' ? 'bg-emerald-50 text-emerald-950 border border-emerald-300' : 'bg-red-50 text-red-950 border border-red-300'}`}>
                {enrollMsg.text}
              </div>
            )}

            <form onSubmit={handleCropEnroll} className="space-y-4 text-xs font-bold text-gray-700">
              <div>
                <label className="block mb-1">{isMr ? 'पीक निवडा' : 'Select Crop'}</label>
                <select
                  value={enrollCrop}
                  onChange={(e) => {
                    const c = e.target.value;
                    setEnrollCrop(c);
                    const opt = COMMODITY_OPTIONS.find(o => o.name.toLowerCase().includes(c.toLowerCase()) || o.key.includes(c.toLowerCase()));
                    if (opt) setEnrollCropCategory(opt.category);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark bg-gray-50"
                >
                  {COMMODITY_OPTIONS.map(c => (
                    <option key={c.key} value={c.name.split(' ')[0]}>{tCrop(c.name, language)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">{isMr ? 'FPO संस्था निवडा' : 'Select FPO Partner'}</label>
                <select
                  value={enrollFpoId}
                  onChange={(e) => setEnrollFpoId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-agro-dark bg-gray-50"
                >
                  {availableFpos.map(f => (
                    <option key={f.id} value={f.id}>
                      [{tDistrict(f.district || 'Pune', language)}] {tEntity(f.name, language)} ({f.storageFacility || 'Hub'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">{isMr ? 'टीप / कारण (ऐच्छिक)' : 'Notes (Optional)'}</label>
                <textarea
                  rows={2}
                  placeholder={isMr ? 'उदा. शीतगृह सोय व थेट खरेदीदार विक्रीसाठी' : 'e.g. Specialized cold storage & buyer contract'}
                  value={enrollNotes}
                  onChange={(e) => setEnrollNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs font-normal"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={enrollSubmitting}
                  className="w-full py-3 rounded-2xl bg-agro-primary hover:bg-agro-bright text-white text-sm font-bold transition-all shadow"
                >
                  {enrollSubmitting ? (isMr ? 'जोडत आहे...' : 'Enrolling...') : (isMr ? 'सभासदत्व पुष्टी करा' : 'Confirm Membership')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
