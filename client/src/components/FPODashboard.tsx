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
  Package,
  Layers,
  Search,
  ArrowRightLeft,
  Truck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Plus,
  Users,
  UserCheck,
  UserX
} from 'lucide-react';

export const FPODashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [activeTab, setActiveTab] = useState<'requests' | 'lots' | 'matches' | 'offers' | 'transactions' | 'disputes'>('requests');
  const [requestSubTab, setRequestSubTab] = useState<'produce' | 'membership'>('produce');
  const [data, setData] = useState<any>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Create Lot Modal state
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [lotCommodity, setLotCommodity] = useState('Onion');
  const [selectedProduceIds, setSelectedProduceIds] = useState<string[]>(['prod_01', 'prod_02']);
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

  const handleMembershipResponse = async (requestId: string, action: 'ACCEPT' | 'REJECT', rejectionReason?: string) => {
    try {
      const res = await fetch(`${API_BASE}/fpo/membership-request/${requestId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          rejectionReason: rejectionReason || (action === 'REJECT' ? 'क्षमता पूर्ण / Capacity full' : undefined),
          resolvedBy: user?.name || 'FPO Manager'
        })
      });
      const result = await res.json();
      if (result.success) {
        setActionSuccess(
          action === 'ACCEPT'
            ? (isMr ? `✅ शेतकरी सभासदत्व मंजूर केले! शेतकरी आता आपल्या FPO चे अधिकृत सदस्य आहेत.` : `✅ Farmer membership accepted!`)
            : (isMr ? `विनंती नाकारली. शेतकऱ्यांची मूळ FPO कायम राहील.` : `Request rejected. Farmer's original FPO remains unchanged.`)
        );
        fetchFpoData();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      console.error('Membership response error:', err);
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
        setActionSuccess(
          isMr
            ? 'व्यावसायिक लॉट तयार झाला व खरेदीदारांसाठी प्रकाशित करण्यात आला!'
            : (result.message || 'Commercial lot created and published for buyers!')
        );
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
        setActionSuccess(
          isMr
            ? `ऑफर मंजूर केली! व्यवहार #${result.transaction?.dealNumber || 'DEAL-8841'} तयार झाला व एस्क्रो सुरक्षित करण्यात आले.`
            : `Offer accepted! Transaction ${result.transaction?.dealNumber || 'DEAL-8841'} created. Escrow secured.`
        );
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
              🏢 {isMr ? 'FPO एकत्रीकरण आणि व्यापार केंद्र' : 'FPO Aggregation & Trading Desk'} • {tMandi('Narayangaon Hub, Pune', language)}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {tEntity(user?.name || 'Shivneri Agri Farmers Producer Co.', language)}
            </h1>
            <p className="text-sm text-emerald-200 mt-1 max-w-xl">
              {isMr
                ? 'शेतकऱ्यांचा शेतमाल गोळा करून प्रमाणित लॉट तयार करा आणि अधिकृत संस्थात्मक खरेदीदारांशी व्यवहार करा.'
                : 'Central Bridge: Aggregating farmer produce into commercial lots and transacting with verified institutional buyers.'}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 px-5 py-3 rounded-2xl border border-white/15">
            <div>
              <div className="text-[10px] text-emerald-300 uppercase font-bold">
                {isMr ? 'FPO विश्वासार्हता गुणांक' : 'FPO Trust Score'}
              </div>
              <div className="text-2xl font-black text-white">94 / 100</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <div className="text-[10px] text-emerald-300 uppercase font-bold">
                {isMr ? 'साठवणूक क्षमता' : 'Capacity'}
              </div>
              <div className="text-sm font-bold text-white">
                {isMr ? '५०० क्विंटल / आठवडा' : '500 Q / week'}
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
            {isMr ? 'शेतमाल प्रस्ताव' : 'Incoming Requests'}
          </div>
          <div className="text-2xl font-black text-agro-text mt-1">
            {data?.incomingFarmerRequests?.length || 2}
          </div>
          <div className="text-[11px] text-amber-600 font-bold">
            {isMr ? 'एकत्रीकरणाची प्रतीक्षा' : 'Awaiting Aggregation'}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase">
            {isMr ? 'सक्रिय लॉट्स' : 'Active Lots'}
          </div>
          <div className="text-2xl font-black text-agro-primary mt-1">
            {data?.activeLots?.length || 2}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">
            {isMr ? 'A प्रत प्रमाणित' : 'Grade A Standardized'}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase">
            {isMr ? 'खरेदीदार मागणी' : 'Buyer Demands'}
          </div>
          <div className="text-2xl font-black text-blue-700 mt-1">
            {data?.openBuyerRequirements?.length || 2}
          </div>
          <div className="text-[11px] text-blue-600 font-bold">
            {isMr ? 'पुणे बाजारपेठ केंद्र' : 'In Pune Market Hub'}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase">
            {isMr ? 'सक्रिय ऑफर्स' : 'Active Offers'}
          </div>
          <div className="text-2xl font-black text-purple-700 mt-1">
            {data?.activeOffers?.length || 1}
          </div>
          <div className="text-[11px] text-purple-600 font-bold">
            {isMr ? 'वाटाघाटी सुरू' : 'Negotiation Active'}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-agro-light shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase">
            {isMr ? 'यशस्वी सौदे' : 'Transactions'}
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            {data?.transactions?.length || 1}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">
            {isMr ? 'एस्क्रो सुरक्षित रक्कम' : 'Escrow Funded'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 mb-6 gap-2 pb-1">
        {[
          { id: 'requests', label: isMr ? '१. शेतकरी प्रस्ताव' : '1. Farmer Requests', icon: Package },
          { id: 'lots', label: isMr ? '२. एकत्रित लॉट्स' : '2. Aggregated Lots', icon: Layers },
          { id: 'matches', label: isMr ? '३. खरेदीदार जुळवणी' : '3. Buyer Matching', icon: Search },
          { id: 'offers', label: isMr ? '४. ऑफर्स व वाटाघाटी' : '4. Offers', icon: ArrowRightLeft },
          { id: 'transactions', label: isMr ? '५. सौदे व एस्क्रो' : '5. Deals & Escrow', icon: Truck },
          { id: 'disputes', label: isMr ? '६. तक्रार निवारण' : '6. Disputes & Claims', icon: Sparkles }
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

      {/* TAB 1: INCOMING FARMER REQUESTS & MEMBERSHIP TRANSFERS */}
      {activeTab === 'requests' && (
        <div className="space-y-5">
          {/* Subtab Toggle */}
          <div className="flex items-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl w-fit">
            <button
              onClick={() => setRequestSubTab('produce')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                requestSubTab === 'produce'
                  ? 'bg-white text-agro-dark shadow-sm'
                  : 'text-gray-500 hover:text-agro-dark'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>{isMr ? 'शेतमाल प्रस्ताव' : 'Produce Submissions'}</span>
            </button>

            <button
              onClick={() => setRequestSubTab('membership')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
                requestSubTab === 'membership'
                  ? 'bg-white text-agro-dark shadow-sm'
                  : 'text-gray-500 hover:text-agro-dark'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isMr ? 'FPO सभासदत्व बदली विनंत्या' : 'Membership Switch Requests'}</span>
              {data?.membershipRequests?.filter((r: any) => r.status === 'PENDING').length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold animate-pulse">
                  {data.membershipRequests.filter((r: any) => r.status === 'PENDING').length}
                </span>
              )}
            </button>
          </div>

          {/* Sub-View A: Farmer Produce Submissions */}
          {requestSubTab === 'produce' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-agro-text">
                    {isMr ? 'शेतकरी शेतमाल प्रस्ताव' : 'Farmer Produce Submissions'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isMr
                      ? 'शेतकरी थेट आपल्या FPO कडे शेतमाल जमा करतात. गुणवत्ता तपासून व्यावसायिक लॉटमध्ये एकत्र करा.'
                      : 'Farmers submit their harvest directly to your FPO. Verify visual quality and combine into commercial lots.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsLotModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-agro-primary text-white text-xs font-bold hover:bg-agro-dark transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isMr ? '+ व्यावसायिक लॉट तयार करा' : '+ Bundle into Commercial Lot'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-agro-light shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-lg font-black text-agro-text">
                        {tEntity('Sopanrao Patil', language)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {tMandi('Otur', language)}, {tMandi('Junnar', language)} • {isMr ? 'मोबाईल:' : 'Mobile:'} 9822012345
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {isMr ? 'A प्रत (९२% अचूकता)' : 'Grade A (92% Conf.)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-agro-dark py-2 border-y border-gray-100 mb-3">
                    <span>{isMr ? 'शेतमाल: लाल कांदा' : 'Commodity: Onion (Nashik Red)'}</span>
                    <span className="text-agro-primary">50 {isMr ? 'क्विंटल' : 'Quintals'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{isMr ? 'कापणी: २०२६-०३-०२' : 'Harvest: 2026-03-02'}</span>
                    <span className="font-bold text-emerald-700">
                      {isMr ? '✓ एकत्रीकरणासाठी तयार' : '✓ Ready for Aggregation'}
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-agro-light shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-lg font-black text-agro-text">
                        {tEntity('Tukaram Shinde', language)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {tMandi('Manchar', language)}, {tMandi('Junnar', language)} • {isMr ? 'मोबाईल:' : 'Mobile:'} 9822987654
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {isMr ? 'A प्रत (९०% अचूकता)' : 'Grade A (90% Conf.)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-agro-dark py-2 border-y border-gray-100 mb-3">
                    <span>{isMr ? 'शेतमाल: लाल कांदा' : 'Commodity: Onion (Nashik Red)'}</span>
                    <span className="text-agro-primary">70 {isMr ? 'क्विंटल' : 'Quintals'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{isMr ? 'कापणी: २०२६-०३-०१' : 'Harvest: 2026-03-01'}</span>
                    <span className="font-bold text-emerald-700">
                      {isMr ? '✓ एकत्रीकरणासाठी तयार' : '✓ Ready for Aggregation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-View B: Farmer Membership Switch Requests */}
          {requestSubTab === 'membership' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-agro-text">
                    {isMr ? 'FPO सभासदत्व व बदली विनंत्या' : 'Farmer Membership & Transfer Requests'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isMr
                      ? 'शेतकऱ्यांनी आपल्या FPO कडे जोडले जाण्यासाठी पाठवलेल्या विनंत्या. आपण मंजूर केल्यावरच शेतकऱ्यांची FPO बदलेल.'
                      : 'Farmers requesting to join your FPO. Acceptance legally registers the farmer under your FPC.'}
                  </p>
                </div>
              </div>

              {(!data?.membershipRequests || data.membershipRequests.length === 0) ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-agro-light text-gray-500 text-xs">
                  {isMr ? 'सध्या कोणतीही प्रलंबित सभासदत्व विनंती नाही.' : 'No membership switch requests at this time.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {data.membershipRequests.map((req: any) => {
                    const isPending = req.status === 'PENDING';
                    const isAccepted = req.status === 'ACCEPTED';

                    return (
                      <div
                        key={req.id}
                        className={`p-5 rounded-3xl border transition-all ${
                          isPending
                            ? 'bg-white border-amber-300 shadow-md'
                            : isAccepted
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-gray-50 border-gray-200 opacity-80'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-extrabold text-agro-text">
                                🌾 {tEntity(req.farmerName, language)}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                                  isPending
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : isAccepted
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : 'bg-red-100 text-red-900'
                                }`}
                              >
                                {isPending
                                  ? (isMr ? '⏳ मंजुरी प्रलंबित' : '⏳ Pending Action')
                                  : isAccepted
                                  ? (isMr ? '✅ स्वीकृत सभासद' : '✅ Enrolled Member')
                                  : (isMr ? '❌ नाकारले' : '❌ Rejected')}
                              </span>
                            </div>

                            <div className="text-xs text-gray-600 flex flex-wrap items-center gap-3">
                              <span>📍 {tMandi(req.farmerVillage || 'Otur', language)}, {tMandi(req.farmerTaluka || 'Junnar', language)}</span>
                              <span>📞 {isMr ? 'मोबाईल:' : 'Mobile:'} {req.farmerMobile || '9822012345'}</span>
                              <span>📅 {new Date(req.requestedAt || req.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="text-xs font-semibold text-gray-700 pt-1">
                              <span className="text-gray-500">{isMr ? 'मागील / मूळ FPO: ' : 'Previous FPO: '}</span>
                              <span className="font-bold text-agro-dark">{tEntity(req.currentFpoName || 'Shivneri FPC', language)}</span>
                            </div>

                            <div className="text-xs text-gray-600 bg-agro-bg p-2.5 rounded-xl border border-agro-light/60">
                              <span className="font-bold text-agro-dark">{isMr ? 'शेतकऱ्याचे कारण: ' : 'Farmer Reason: '}</span>
                              {req.reason}
                            </div>
                          </div>

                          {isPending && (
                            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                              <button
                                onClick={() => handleMembershipResponse(req.id, 'ACCEPT')}
                                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                              >
                                <UserCheck className="w-4 h-4" />
                                <span>{isMr ? 'स्वीकारा (Accept)' : 'Accept & Enroll'}</span>
                              </button>

                              <button
                                onClick={() => handleMembershipResponse(req.id, 'REJECT')}
                                className="px-3.5 py-2.5 rounded-xl bg-white border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold transition-all flex items-center gap-1.5"
                              >
                                <UserX className="w-4 h-4" />
                                <span>{isMr ? 'नाकारा (Reject)' : 'Reject'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AGGREGATED COMMERCIAL LOTS */}
      {activeTab === 'lots' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-lg font-black text-agro-text">
              {isMr ? 'प्रमाणित व्यावसायिक लॉट्स' : 'Standardized Commercial Lots'}
            </h3>
            <button
              onClick={() => setIsLotModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-agro-primary text-white text-xs font-bold hover:bg-agro-dark transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{isMr ? '+ नवीन लॉट तयार करा' : 'Create New Lot'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(data?.activeLots || [
              {
                id: 'lot_01',
                lotNumber: 'LOT-PUN-ON-2026-01',
                commodity: 'Onion',
                qualityGrade: 'Grade A',
                totalQuantity: 120,
                expectedPricePerQuintal: 2850,
                pickupHub: 'Narayangaon Hub, Junnar, Pune',
                participatingFarmerIds: ['usr_01', 'usr_02'],
                status: 'AGGREGATED'
              }
            ]).map((lot: any) => (
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
                      {tCrop(lot.commodity, language)} ({tGrade(lot.qualityGrade, language)})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-agro-dark">
                      {lot.totalQuantity} <span className="text-xs font-normal">{isMr ? 'क्विंटल' : 'Quintals'}</span>
                    </div>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                      {tStatus('AGGREGATED_INTO_LOT', language)}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-agro-bg border border-agro-light text-xs space-y-1.5 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{isMr ? 'अपेक्षित पायाभूत दर:' : 'Expected Base Price:'}</span>
                    <span className="font-bold text-agro-dark">₹{lot.expectedPricePerQuintal} / {isMr ? 'क्विंटल' : 'q'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{isMr ? 'संकलन केंद्र:' : 'Pickup Hub:'}</span>
                    <span className="font-bold text-gray-700">{tMandi(lot.pickupHub, language)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{isMr ? 'सहभागी शेतकरी:' : 'Participating Farmers:'}</span>
                    <span className="font-bold text-emerald-700">
                      {lot.participatingFarmerIds?.length || 2} {isMr ? 'शेतकरी एकत्रित' : 'Farmers Combined'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('matches')}
                  className="w-full py-2.5 rounded-xl bg-agro-mint text-agro-dark font-bold text-xs hover:bg-agro-primary hover:text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>
                    {isMr
                      ? `जुळणारे खरेदीदार पहा (${data?.openBuyerRequirements?.length || 2})`
                      : `View Matched Buyers (${data?.openBuyerRequirements?.length || 2})`}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BUYER MATCHING ENGINE */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-black text-agro-text flex items-center gap-2">
              <Search className="w-5 h-5 text-agro-primary" />
              <span>
                {isMr ? 'अल्गोरिथमिक खरेदीदार जुळवणी इंजिन' : 'Algorithmic Buyer-Lot Matching Engine'}
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              {isMr
                ? 'शेतमाल, प्रतवारी, प्रमाण, पुणे जिल्हा वाहतूक अंतर आणि किंमत नफा यांचे विश्लेषण.'
                : 'Evaluates commodity, Grade A spec, volume, Pune district transit distance, and pricing margin.'}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/40 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isMr ? '९४% सुसंगतता जुळवणी' : '94% Compatibility Match'}</span>
                </div>
                <h4 className="text-xl font-bold text-agro-text">
                  {tEntity('Sahyadri Fresh Wholesale Pvt Ltd', language)}
                </h4>
                <div className="text-xs text-gray-500 mt-0.5">
                  {isMr
                    ? `संपर्क: ${tEntity('Rajesh Mehta', language)} • ${tMandi('Pune Market Yard, Gultekdi', language)} • ९२/१०० विश्वासार्हता`
                    : 'Contact: Rajesh Mehta • Pune Market Yard, Gultekdi • 92/100 Trust Score'}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400 font-bold uppercase">
                  {isMr ? 'खरेदीदार अपेक्षित दर' : 'Buyer Target Rate'}
                </div>
                <div className="text-2xl font-black text-agro-dark">₹2,800 – ₹2,900 / {isMr ? 'क्विंटल' : 'q'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 text-xs">
              <div className="p-3 rounded-xl bg-agro-bg">
                <span className="text-gray-400">{isMr ? 'मागणी:' : 'Demand:'}</span>
                <div className="font-bold text-agro-dark mt-0.5">
                  100 {isMr ? 'क्विंटल कांदा (A प्रत)' : 'Quintals Onion (Grade A)'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-agro-bg">
                <span className="text-gray-400">{isMr ? 'आपला एकत्रित लॉट:' : 'Your Aggregated Lot:'}</span>
                <div className="font-bold text-agro-dark mt-0.5">LOT-PUN-ON-2026-01 (120Q Avail.)</div>
              </div>
              <div className="p-3 rounded-xl bg-agro-bg">
                <span className="text-gray-400">{isMr ? 'वाहतूक अंतर:' : 'Transit Distance:'}</span>
                <div className="font-bold text-emerald-700 mt-0.5">
                  {isMr ? '६८ किमी (नारायणगाव → गुलटेकडी)' : '68 km (Narayangaon → Gultekdi)'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="text-xs text-gray-600">
                {isMr ? (
                  <span>जुळवणी निकष: <strong>तंतोतंत शेतमाल</strong> • <strong>A प्रत गुणवत्ता</strong> • <strong>पूर्ण प्रमाण पूर्तता</strong></span>
                ) : (
                  <span>Match Rationale: <strong>Exact Commodity</strong> • <strong>Grade A Overlap</strong> • <strong>Full Quantity Coverage</strong></span>
                )}
              </div>
              <button
                onClick={() => setActiveTab('offers')}
                className="px-5 py-2.5 rounded-xl bg-agro-primary text-white font-bold text-xs hover:bg-agro-dark transition-all flex items-center gap-1.5"
              >
                <span>{isMr ? 'बोली व प्रति-ऑफर पहा' : 'View Bidding & Counter-Offer'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OFFERS & NEGOTIATION DESK */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-agro-text">
            {isMr ? 'द्विपक्षीय किंमत वाटाघाटी टेबल' : 'Bilateral Price Negotiation Desk'}
          </h3>

          <div className="bg-white rounded-3xl p-6 border border-agro-light shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase">
                  {isMr ? 'खरेदीदाराकडून प्रति-ऑफर प्राप्त' : 'Buyer Counter-Offer Received'}
                </span>
                <h4 className="text-xl font-black text-agro-text mt-2">
                  {isMr ? 'LOT-PUN-ON-2026-01 वर ऑफर (१०० क्विंटल)' : 'Offer on LOT-PUN-ON-2026-01 (100 Quintals)'}
                </h4>
                <p className="text-xs text-gray-500">
                  {isMr ? 'खरेदीदार:' : 'From:'} <strong>{tEntity('Sahyadri Fresh Wholesale Pvt Ltd', language)}</strong>
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400 uppercase font-bold">
                  {isMr ? 'प्रति-दर' : 'Counter Rate'}
                </div>
                <div className="text-3xl font-black text-emerald-700">₹2,820 <span className="text-xs">/ {isMr ? 'क्विंटल' : 'q'}</span></div>
                <div className="text-[11px] text-gray-500 line-through">
                  {isMr ? 'मूळ अपेक्षित: ₹२,८५०/q' : 'Original quote: ₹2,850/q'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-agro-bg border border-agro-light/80 text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">{isMr ? 'डिलिव्हरी अटी:' : 'Delivery Terms:'}</span>
                <span className="font-bold text-agro-dark">
                  {isMr
                    ? 'FPO गोदाम डिलिव्हरी (FPO वाहतूक व्यवस्था करेल, खरेदीदार ₹७५/क्विंटल परत करेल)'
                    : 'Ex-FPO Warehouse (FPO arranges transport, buyer reimburses ₹75/q)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{isMr ? 'एकूण करार मूल्य:' : 'Total Contract Value:'}</span>
                <span className="font-bold text-agro-dark">
                  ₹2,82,000 ({isMr ? '१०० क्विंटल × ₹२,८२०' : '100 Quintals × ₹2,820'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{isMr ? 'एस्क्रो सुरक्षा अट:' : 'Escrow Condition:'}</span>
                <span className="font-bold text-emerald-800">
                  {isMr ? 'वाहतूक सुरू होताच १००% रक्कम सुरक्षित लॉक' : '100% Locked on transit dispatch'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => handleAcceptOffer('off_01')}
                className="px-6 py-3 rounded-2xl bg-agro-primary hover:bg-agro-dark text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isMr ? 'प्रति-ऑफर स्वीकारा व सौदा पक्का करा' : 'Accept Counter-Offer & Confirm Deal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TRANSACTIONS, LOGISTICS & FARMER PAYOUTS */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-agro-text">
            {isMr ? 'पक्के सौदे व वाहतूक ट्रॅकिंग' : 'Confirmed Trades & Logistics'}
          </h3>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agro-light shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <div className="text-xs font-black text-agro-primary uppercase">DEAL-AGV-2026-8841</div>
                <h4 className="text-xl font-bold text-agro-text mt-0.5">
                  100 {isMr ? 'क्विंटल कांदा (A प्रत)' : 'Quintals Onion (Grade A)'}
                </h4>
                <p className="text-xs text-gray-500">
                  {isMr
                    ? `खरेदीदार: ${tEntity('Sahyadri Fresh Wholesale Pvt Ltd', language)} • दर: ₹२,८२० / क्विंटल`
                    : 'Buyer: Sahyadri Fresh Wholesale • Rate: ₹2,820 / q'}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400 uppercase font-bold">
                  {isMr ? 'एकूण रक्कम' : 'Gross Total'}
                </div>
                <div className="text-2xl font-black text-agro-dark">₹2,82,000</div>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase">
                  {tStatus('IN_TRANSIT', language)}
                </span>
              </div>
            </div>

            {/* Logistics Tracking Strip */}
            <div className="p-5 rounded-2xl bg-agro-bg border border-agro-light space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-agro-mint text-agro-primary flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-agro-dark">
                    {isMr ? 'महालक्ष्मी ॲग्रो लॉजिस्टिक्स (MH-14-CW-4921)' : 'Mahalaxmi Agro Logistics (MH-14-CW-4921)'}
                  </div>
                  <div className="text-gray-500">
                    {isMr
                      ? 'स्थिती: नारायणगाव हब येथे माल भरला • गुलटेकडी मार्केट यार्डकडे रवाना (अपेक्षित वेळ: संध्याकाळी ६:००)'
                      : 'Status: Loaded at Narayangaon Hub • In Transit to Gultekdi Mandi (ETA: 6:00 PM)'}
                  </div>
                </div>
              </div>

              {/* Milestone Step Tracker */}
              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                  {isMr ? '✓ १. रवाना झाले' : '✓ 1. Dispatched'}
                </div>
                <div className="p-2 rounded-xl bg-blue-100 text-blue-800 font-bold animate-pulse">
                  {isMr ? '● २. वाहतुकीत' : '● 2. In Transit'}
                </div>
                <div className="p-2 rounded-xl bg-gray-100 text-gray-500">
                  {isMr ? '३. मंडईत पोहोचले' : '3. Hub Arrival'}
                </div>
                <div className="p-2 rounded-xl bg-gray-100 text-gray-500">
                  {isMr ? '४. एस्क्रो जमा' : '4. Escrow Settled'}
                </div>
              </div>
            </div>

            {/* Farmer Payout Distribution Ledger */}
            <div>
              <h5 className="text-xs font-extrabold text-agro-text uppercase tracking-wider mb-3">
                {isMr
                  ? 'शेतकरी परतावा वितरण तपशील (थेट FPO बँक हस्तांतरण):'
                  : 'Automated Farmer Settlement Breakdown (Strict FPO Bridge):'}
              </h5>
              <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                    <tr>
                      <th className="p-3">{isMr ? 'शेतकऱ्याचे नाव' : 'Farmer Name'}</th>
                      <th className="p-3">{isMr ? 'प्रमाण' : 'Quantity'}</th>
                      <th className="p-3">{isMr ? 'निव्वळ दर' : 'Net In-Hand Rate'}</th>
                      <th className="p-3">{isMr ? 'एकूण देय रक्कम' : 'Total Payable'}</th>
                      <th className="p-3">{isMr ? 'स्थिती' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    <tr>
                      <td className="p-3 font-bold text-agro-dark">
                        {tEntity('Sopanrao Patil', language)} ({tMandi('Otur', language)})
                      </td>
                      <td className="p-3">50 {isMr ? 'क्विंटल' : 'Quintals'}</td>
                      <td className="p-3 text-agro-primary font-bold">₹2,745 / {isMr ? 'क्विंटल' : 'q'}</td>
                      <td className="p-3 font-bold">₹1,37,250</td>
                      <td className="p-3">
                        <span className="text-emerald-700 font-bold">
                          {tStatus('ESCROW_FUNDED', language)}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-agro-dark">
                        {tEntity('Tukaram Shinde', language)} ({tMandi('Manchar', language)})
                      </td>
                      <td className="p-3">50 {isMr ? 'क्विंटल' : 'Quintals'}</td>
                      <td className="p-3 text-agro-primary font-bold">₹2,745 / {isMr ? 'क्विंटल' : 'q'}</td>
                      <td className="p-3 font-bold">₹1,37,250</td>
                      <td className="p-3">
                        <span className="text-emerald-700 font-bold">
                          {tStatus('ESCROW_FUNDED', language)}
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

      {/* TAB 6: DISPUTES & RESOLUTION */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-agro-text">
              {isMr ? 'खरेदीदार तक्रारी व गुणवत्ता पडताळणी' : 'Buyer Claims & Quality Verification'}
            </h3>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {isMr ? 'MSAMB लवाद संरक्षित' : 'MSAMB Tribunal Protected'}
            </span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-agro-light shadow-sm space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-amber-900 uppercase">
                    {isMr ? 'सक्रिय तक्रार (लॉट LOT-PUN-ON-2026-01)' : 'Active Dispute (Lot LOT-PUN-ON-2026-01)'}
                  </span>
                  <p className="text-amber-800 mt-1">
                    {isMr
                      ? 'खरेदीदाराने ओलावा तफावतीचा दावा नोंदवला: "वरच्या थरातील गोण्यांमध्ये ओलाव्याची तफावत (Grade A मानांकनापेक्षा ३% जादा)"'
                      : 'Buyer raised moisture variance claim: "Slight moisture variance on top layer bags (3% above Grade A spec)"'}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                  {tStatus('OPEN', language)}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-amber-200 text-gray-600 flex justify-between">
                <span>{isMr ? 'दावा रक्कम:' : 'Claimed Amount:'} <strong>₹6,000</strong></span>
                <span>{isMr ? 'लवाद अधिकारी:' : 'Arbitrator:'} <strong>{tEntity('Market Regulator (MSAMB)', language)}</strong></span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-agro-bg border border-agro-light text-xs text-gray-600">
              <div className="font-bold text-agro-dark mb-1">
                {isMr ? 'FPO प्रति-पुरावा:' : 'FPO Counter Evidence:'}
              </div>
              <p>
                {isMr
                  ? 'नारायणगाव हब येथे गाडी भरण्यापूर्वी काढलेले डिजिटल AI प्रमाणपत्र ९२% Grade A दर्जा व सुकी मान (dry neck) गुणवत्ता प्रमाणित करते. पूर्ण एस्क्रो मुक्तीसाठी राज्य लवादाकडे पुरावे दाखल.'
                  : 'Pre-dispatch AI grading certificate generated at Narayangaon Hub confirmed 92% Grade A compliance with dry neck integrity. Submitted to state tribunal for full escrow release.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE AGGREGATED LOT */}
      {isLotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-agro-light shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-agro-mint text-agro-primary">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-agro-text">
                  {isMr ? 'प्रमाणित व्यावसायिक लॉट तयार करा' : 'Create Aggregated Commercial Lot'}
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
                  {isMr ? 'शेतमाल' : 'Commodity'}
                </label>
                <select
                  value={lotCommodity}
                  onChange={e => setLotCommodity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white outline-none focus:border-agro-primary"
                >
                  <option value="Onion">{isMr ? '🧅 कांदा (Onion)' : '🧅 Onion (कांदा)'}</option>
                  <option value="Tomato">{isMr ? '🍅 टोमॅटो (Tomato)' : '🍅 Tomato (टोमॅटो)'}</option>
                  <option value="Grapes">{isMr ? '🍇 द्राक्षे (Grapes)' : '🍇 Grapes (द्राक्षे)'}</option>
                  <option value="Pomegranate">{isMr ? '🍎 डाळिंब (Pomegranate)' : '🍎 Pomegranate (डाळिंब)'}</option>
                  <option value="Soybean">{isMr ? '🌱 सोयाबीन (Soybean)' : '🌱 Soybean (सोयाबीन)'}</option>
                  <option value="Cabbage">{isMr ? '🥬 कोबी (Cabbage)' : '🥬 Cabbage (कोबी)'}</option>
                  <option value="Sugarcane">{isMr ? '🎋 ऊस (Sugarcane)' : '🎋 Sugarcane (ऊस)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-agro-text mb-1.5">
                  {isMr
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
                      {isMr
                        ? `${tEntity('Sopanrao Patil', language)} • ५० क्विंटल कांदा (A प्रत, ओतूर)`
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
                      {isMr
                        ? `${tEntity('Tukaram Shinde', language)} • ७० क्विंटल कांदा (A प्रत, मंचर)`
                        : 'Tukaram Shinde • 70 Quintals Onion (Grade A, Manchar)'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-agro-text mb-1">
                    {isMr ? 'अपेक्षित दर (₹/क्विंटल)' : 'Expected Rate (₹/q)'}
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
                    {isMr ? 'किमान दर (₹/क्विंटल)' : 'Minimum Rate (₹/q)'}
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
                  {isMr ? 'संकलन केंद्र / गोदाम' : 'Pickup Hub / Warehouse'}
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
                {isMr
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
