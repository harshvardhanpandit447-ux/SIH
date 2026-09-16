import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE } from '../utils/apiConfig';
import {
  tEntity,
  tMandi,
  tStatus,
  tDispute
} from '../utils/translationHelper';

interface PlatformMetrics {
  registeredFarmers: number;
  registeredFPOs: number;
  verifiedBuyers: number;
  totalProducesSubmitted: number;
  activeLots: number;
  completedTransactions: number;
  totalTradeVolumeINR: number;
  totalQuantityQuintals: number;
  activeEscrowSecuredINR: number;
  openDisputesCount: number;
  apmcMandisMonitored: number;
  avgFarmerGainPercentage: string;
}

interface Dispute {
  id: string;
  lotId?: string;
  lotNumber?: string;
  transactionId?: string;
  raisedBy: string;
  raisedByName: string;
  raisedByRole: string;
  againstUser: string;
  againstUserName: string;
  reason: string;
  disputeCategory: string;
  evidenceUrl?: string;
  claimedAmount: number;
  status: string;
  resolutionNotes?: string;
  arbitratedBy?: string;
  createdAt: string;
}

interface AdminLog {
  id: string;
  action: string;
  targetId: string;
  performedBy: string;
  details: any;
  createdAt: string;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [activeTab, setActiveTab] = useState<'overview' | 'disputes' | 'kyc' | 'market_feeds' | 'logs'>('overview');
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Dispute resolution modal
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<string>('RESOLVED_RELEASE');
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [overviewRes, disputesRes, logsRes, healthRes] = await Promise.all([
        fetch(`${API_BASE}/admin/overview`).then(r => r.json()),
        fetch(`${API_BASE}/admin/disputes`).then(r => r.json()),
        fetch(`${API_BASE}/admin/logs`).then(r => r.json()),
        fetch(`${API_BASE}/health`).then(r => r.json())
      ]);

      if (overviewRes.success) setMetrics(overviewRes.metrics);
      if (disputesRes.success) setDisputes(disputesRes.disputes);
      if (logsRes.success) setLogs(logsRes.logs);
      if (healthRes.supabase) setSupabaseStatus(healthRes.supabase);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;

    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE}/admin/disputes/${selectedDispute.id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: resolutionStatus,
          resolutionNotes: resolutionNotes || (isMr ? 'राज्य कृषी लवाद समितीने गुणवत्ता तपासणीअंती निर्णय दिला.' : 'Arbitrated by MSAMB State Tribunal.'),
          refundAmount: resolutionStatus === 'RESOLVED_PARTIAL_SETTLEMENT' ? refundAmount : 0,
          arbitratedBy: user?.name || 'Dr. Nitin Thorat (MSAMB Director)'
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(isMr ? 'तक्रार निवारण व एस्क्रो सेटलमेंट यशस्वीरित्या पूर्ण झाले!' : 'Dispute resolved and escrow settlement updated successfully!');
        setSelectedDispute(null);
        fetchAdminData();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Resolution error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyUser = async (targetUserId: string, verify: boolean) => {
    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE}/admin/users/${targetUserId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verified: verify,
          trustScore: 96,
          auditedBy: user?.name || 'MSAMB Officer'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(isMr ? 'वापरकर्ता केवायसी स्थिती अद्यतनित झाली!' : 'User KYC status & Trust score updated!');
        fetchAdminData();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Verify error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm(isMr ? 'तुम्हाला डेमो डेटाबेस पुन्हा रीसेट करायचा आहे का?' : 'Reset demo database to fresh Pune agricultural state?')) return;
    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE}/system/reset-demo`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(isMr ? 'डेटाबेस यशस्वीरीत्या रीसेट झाला!' : 'Database successfully reset!');
        fetchAdminData();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-800/40 mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isMr ? 'राज्य कृषी बाजार नियामक केंद्र' : 'State Agricultural Market Regulator'}
              </span>
              <span className="text-xs text-indigo-300">MSAMB Authority Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>🏛️</span> {isMr ? 'अ‍ॅग्रोव्हिजन नियामक व नियंत्रण कक्ष' : 'AgroVision Operations & Regulatory Center'}
            </h1>
            <p className="text-indigo-200/80 text-sm mt-1 max-w-2xl">
              {isMr
                ? 'महाराष्ट्र राज्य कृषी पणन मंडळ - शेतकरी, FPO, खरेदीदार व्यवहार देखरेख, तक्रार निवारण आणि एस्क्रो सुरक्षितता.'
                : 'Market oversight, multi-mandi APMC feed integrity, dispute arbitration, and secure escrow disbursement monitoring.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              className="px-4 py-2 bg-indigo-800/60 hover:bg-indigo-700/80 text-white text-xs font-semibold rounded-lg border border-indigo-600/50 transition-all flex items-center gap-1.5"
            >
              <span>🔄</span> {isMr ? 'रिफ्रेश डेटा' : 'Refresh'}
            </button>
            <button
              onClick={handleResetDemo}
              disabled={actionLoading}
              className="px-4 py-2 bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 text-xs font-semibold rounded-lg border border-rose-700/50 transition-all flex items-center gap-1.5"
            >
              <span>⚙️</span> {isMr ? 'डेमो रीसेट' : 'Reset Demo DB'}
            </button>
          </div>
        </div>

        {/* Supabase Status Chip */}
        {supabaseStatus && (
          <div className="mt-6 pt-4 border-t border-indigo-800/40 flex flex-wrap items-center gap-4 text-xs text-indigo-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Supabase PostgreSQL: <strong>{supabaseStatus.connected ? (isMr ? 'सक्रिय (थेट जोडणी)' : 'Active (Live Sync)') : 'Local Fallback'}</strong></span>
            </div>
            <div className="text-indigo-400">Project: <code className="bg-indigo-950/80 px-1.5 py-0.5 rounded text-indigo-200">{supabaseStatus.projectId}</code></div>
            <div className="text-indigo-400">{isMr ? 'सक्रिय टेबल्स:' : 'Tables Live:'} <strong className="text-white">{Object.keys(supabaseStatus.collections || {}).length} Collections</strong></div>
          </div>
        )}
      </div>

      {/* Alert / Notification */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center gap-2">
          <span>✅</span> {successMsg}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-agro-border mb-8 overflow-x-auto pb-2">
        {[
          { id: 'overview', labelEn: 'Network KPIs & Volume', labelMr: 'नेटवर्क आढावा', icon: '📊' },
          { id: 'disputes', labelEn: `Dispute Arbitration (${disputes.filter(d => d.status === 'OPEN').length})`, labelMr: `तक्रार निवारण (${disputes.filter(d => d.status === 'OPEN').length})`, icon: '⚖️' },
          { id: 'kyc', labelEn: 'Stakeholder KYC & Trust', labelMr: 'केवायसी व विश्वास पात्रता', icon: '🛡️' },
          { id: 'market_feeds', labelEn: 'APMC Feeds & Mandis', labelMr: 'बाजार भाव संकलन', icon: '🌾' },
          { id: 'logs', labelEn: 'Regulatory Audit Logs', labelMr: 'ऑडिट लॉग्स', icon: '📜' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-agro-primary text-white shadow-md'
                : 'text-agro-muted hover:text-agro-text hover:bg-agro-card'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{isMr ? tab.labelMr : tab.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && !metrics && (
        <div className="p-12 text-center bg-agro-card border border-agro-border rounded-2xl shadow-sm mb-6">
          <div className="text-2xl animate-spin inline-block mb-2">🔄</div>
          <div className="text-sm font-bold text-agro-text">
            {isMr ? 'नियामक डेटा व एस्क्रो स्थिती लोड होत आहे...' : 'Loading State Regulatory Metrics & Escrow Status...'}
          </div>
        </div>
      )}

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-agro-card border border-agro-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-agro-muted uppercase tracking-wider">
                  {isMr ? 'एकूण व्यापार उलाढाल' : 'Total Traded Volume'}
                </span>
                <span className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg text-lg">💰</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-agro-text">
                  ₹{(metrics?.totalTradeVolumeINR || 282000).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-1">
                  {metrics?.totalQuantityQuintals || 100} {isMr ? 'क्विंटल व्यापार' : 'Qty Traded'}
                </div>
              </div>
            </div>

            <div className="bg-agro-card border border-agro-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-agro-muted uppercase tracking-wider">
                  {isMr ? 'सुरक्षित एस्क्रो रक्कम' : 'Escrow Secured Funds'}
                </span>
                <span className="p-2 bg-blue-500/10 text-blue-600 rounded-lg text-lg">🔒</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-agro-text">
                  ₹{(metrics?.activeEscrowSecuredINR || 282000).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-blue-600 font-medium mt-1">
                  {isMr ? '१००% बँक एस्क्रो संरक्षित' : '100% Protected in Transit'}
                </div>
              </div>
            </div>

            <div className="bg-agro-card border border-agro-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-agro-muted uppercase tracking-wider">
                  {isMr ? 'शेतकरी निव्वळ परतावा वाढ' : 'Avg Farmer Net Gain'}
                </span>
                <span className="p-2 bg-purple-500/10 text-purple-600 rounded-lg text-lg">📈</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-agro-text">
                  {metrics?.avgFarmerGainPercentage || '+24.6%'}
                </div>
                <div className="text-xs text-purple-600 font-medium mt-1">
                  {isMr ? 'पारंपरिक दलालांपेक्षा जादा दर' : 'Over Traditional Intermediary'}
                </div>
              </div>
            </div>

            <div className="bg-agro-card border border-agro-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-agro-muted uppercase tracking-wider">
                  {isMr ? 'सक्रिय APMC बाजारपेठा' : 'Monitored APMC Mandis'}
                </span>
                <span className="p-2 bg-amber-500/10 text-amber-600 rounded-lg text-lg">🏛️</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-agro-text">
                  {metrics?.apmcMandisMonitored || 8}
                </div>
                <div className="text-xs text-amber-600 font-medium mt-1">
                  {isMr ? 'थेट बाजारभाव जोडणी' : 'Live Agmarknet Connected'}
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Network Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-agro-card border border-agro-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-agro-text text-sm mb-4 flex items-center gap-2">
                <span>🌱</span> {isMr ? 'शेतकरी आणि FPO सहभाग' : 'Farmer & FPO Aggregation Network'}
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-agro-border">
                  <span className="text-agro-muted">{isMr ? 'नोंदणीकृत शेतकरी' : 'Registered Farmers'}</span>
                  <strong className="text-agro-text">{metrics?.registeredFarmers || 1}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-agro-border">
                  <span className="text-agro-muted">{isMr ? 'सक्रिय FPO संस्था' : 'Active FPCs / Hubs'}</span>
                  <strong className="text-agro-text">{metrics?.registeredFPOs || 1}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-agro-border">
                  <span className="text-agro-muted">{isMr ? 'सादर केलेला शेतीमाल' : 'Produce Submissions'}</span>
                  <strong className="text-agro-text">{metrics?.totalProducesSubmitted || 2}</strong>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-agro-muted">{isMr ? 'तयार व्यावसायिक लॉट्स' : 'Commercial Aggregate Lots'}</span>
                  <strong className="text-emerald-600">{metrics?.activeLots || 1}</strong>
                </div>
              </div>
            </div>

            <div className="bg-agro-card border border-agro-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-agro-text text-sm mb-4 flex items-center gap-2">
                <span>🏢</span> {isMr ? 'संस्थात्मक खरेदीदार आणि सौदे' : 'Buyer Contracts & Settlements'}
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-agro-border">
                  <span className="text-agro-muted">{isMr ? 'तपासलेले खरेदीदार' : 'Verified Institutional Buyers'}</span>
                  <strong className="text-agro-text">{metrics?.verifiedBuyers || 1}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-agro-border">
                  <span className="text-agro-muted">{isMr ? 'पूर्ण झालेले सौदे' : 'Completed Deals'}</span>
                  <strong className="text-agro-text">{metrics?.completedTransactions || 1}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-agro-border">
                  <span className="text-agro-muted">{isMr ? 'तक्रार निवारण दर' : 'Dispute Resolution Rate'}</span>
                  <strong className="text-emerald-600">100%</strong>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-agro-muted">{isMr ? 'पेमेंट सेटलमेंट वेळ' : 'Avg Payout Cycle'}</span>
                  <strong className="text-agro-text">&lt; 24 {isMr ? 'तास' : 'Hours'}</strong>
                </div>
              </div>
            </div>

            <div className="bg-agro-card border border-agro-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-agro-text text-sm mb-4 flex items-center gap-2">
                <span>🤖</span> {isMr ? 'AI बुद्धिमत्ता व गुणवत्ता नियंत्रण' : 'AI Intelligence & Engine Health'}
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-agro-border">
                  <span className="text-agro-muted">{isMr ? 'ML भाव अंदाज मॉडेल' : 'ML Price Forecaster'}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600">{isMr ? 'सक्रिय' : 'Online'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-agro-border">
                  <span className="text-agro-muted">{isMr ? 'निव्वळ परतावा कॅल्क्युलेटर' : 'Net Realisation Engine'}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600">{isMr ? 'प्रमाणित' : 'Calibrated'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-agro-border">
                  <span className="text-agro-muted">{isMr ? 'AI प्रतवारी कॅमेरा' : 'Computer Vision Grading'}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600">92%+ {isMr ? 'अचूकता' : 'Conf'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-agro-muted">{isMr ? 'ONDC / e-NAM प्रोटोकॉल' : 'ONDC / Agmarknet Sync'}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-600">Live API</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISPUTE ARBITRATION */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-agro-text">
                {isMr ? 'तक्रार निवारण व एस्क्रो लवाद केंद्र' : 'Dispute Arbitration & Escrow Tribunal'}
              </h2>
              <p className="text-sm text-agro-muted">
                {isMr
                  ? 'खरेदीदार किंवा FPO कडून नोंदवलेल्या गुणवत्तेच्या व वितरणाच्या तक्रारींचे जलद निवारण करा.'
                  : 'Review raised quality or delivery variances, inspect evidence, and release/refund escrow.'}
              </p>
            </div>
          </div>

          <div className="bg-agro-card border border-agro-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-agro-border text-sm">
                <thead className="bg-agro-bg">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-agro-muted uppercase">{isMr ? 'क्रमांक व तारीख' : 'ID & Date'}</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-agro-muted uppercase">{isMr ? 'तक्रारदार / पक्ष' : 'Raised By / Against'}</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-agro-muted uppercase">{isMr ? 'कारण व प्रकार' : 'Reason & Category'}</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-agro-muted uppercase">{isMr ? 'दावा रक्कम' : 'Claimed Amount'}</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-agro-muted uppercase">{isMr ? 'स्थिती' : 'Status'}</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-agro-muted uppercase">{isMr ? 'कृती' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-agro-border">
                  {disputes.map(disp => (
                    <tr key={disp.id} className="hover:bg-agro-card/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-agro-text">{disp.id}</div>
                        <div className="text-xs text-agro-muted">{new Date(disp.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-indigo-500 font-mono mt-0.5">{disp.lotNumber || 'Lot Ref'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-agro-text">
                          {tEntity(disp.raisedByName, language)} ({tEntity(disp.raisedByRole, language)})
                        </div>
                        <div className="text-xs text-agro-muted">
                          {isMr ? 'विरुद्ध:' : 'Against:'} {tEntity(disp.againstUserName, language)}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="text-agro-text font-medium text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded inline-block mb-1">
                          {tDispute(disp.disputeCategory, language)}
                        </div>
                        <p className="text-xs text-agro-muted line-clamp-2">
                          {isMr ? 'वरच्या थरातील गोण्यांमध्ये ओलाव्याची तफावत (Grade A मानांकनापेक्षा ३% जादा)' : disp.reason}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-agro-text">
                        ₹{disp.claimedAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          disp.status === 'OPEN'
                            ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                            : disp.status === 'RESOLVED_RELEASE'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                        }`}>
                          {tStatus(disp.status, language)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => {
                            setSelectedDispute(disp);
                            setRefundAmount(disp.claimedAmount);
                          }}
                          className="px-3 py-1.5 bg-agro-primary hover:bg-agro-primary/90 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                        >
                          {disp.status === 'OPEN' ? (isMr ? 'लवाद निर्णय द्या' : 'Arbitrate') : (isMr ? 'पहा' : 'View Notes')}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {disputes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-agro-muted">
                        {isMr ? 'कोणतीही खुली तक्रार नाही.' : 'No active disputes found on the platform.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dispute Arbitration Modal */}
          {selectedDispute && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-agro-card border border-agro-border rounded-2xl p-6 max-w-xl w-full shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-agro-border pb-4 mb-4">
                  <h3 className="text-lg font-bold text-agro-text flex items-center gap-2">
                    <span>⚖️</span> {isMr ? 'तक्रार निवारण व लवाद निर्णय' : 'Dispute Arbitration Hearing'}
                  </h3>
                  <button
                    onClick={() => setSelectedDispute(null)}
                    className="p-1.5 text-agro-muted hover:text-agro-text rounded-lg hover:bg-agro-bg"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-agro-bg rounded-xl border border-agro-border">
                    <div className="flex justify-between text-xs text-agro-muted">
                      <span>{isMr ? 'तक्रार क्रमांक:' : 'Dispute ID:'} <strong>{selectedDispute.id}</strong></span>
                      <span>{isMr ? 'लॉट:' : 'Lot:'} <strong>{selectedDispute.lotNumber}</strong></span>
                    </div>
                    <div className="mt-2 text-agro-text font-medium">
                      {isMr ? 'कारण:' : 'Reason:'}{' '}
                      <span className="font-normal text-agro-muted">
                        {isMr ? 'वरच्या थरातील गोण्यांमध्ये ओलाव्याची तफावत (Grade A मानांकनापेक्षा ३% जादा)' : selectedDispute.reason}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-agro-muted">
                      {isMr ? 'दावा रक्कम:' : 'Claimed Variance:'}{' '}
                      <strong className="text-rose-600">₹{selectedDispute.claimedAmount.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <form onSubmit={handleResolveDispute} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-agro-muted mb-1">
                        {isMr ? 'लवाद निर्णय पर्याय' : 'Tribunal Ruling Verdict'}
                      </label>
                      <select
                        value={resolutionStatus}
                        onChange={e => setResolutionStatus(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-agro-border bg-agro-bg text-agro-text text-sm focus:ring-2 focus:ring-agro-primary"
                      >
                        <option value="RESOLVED_RELEASE">
                          {isMr ? 'FPO कडे पूर्ण एस्क्रो रक्कम वर्ग करा (Grade A गुणवत्ता प्रमाणित)' : 'Full Escrow Release to FPO (Grade verified as per standard)'}
                        </option>
                        <option value="RESOLVED_PARTIAL_SETTLEMENT">
                          {isMr ? 'अंशतः सेटलमेंट (नुकसान रक्कम वजा करून उर्वरित वर्ग करा)' : 'Partial Settlement (Adjust ₹ variance and release balance)'}
                        </option>
                        <option value="RESOLVED_REFUND">
                          {isMr ? 'खरेदीदारास पूर्ण परतावा (गंभीर त्रुटीमुळे माल नाकारला)' : 'Full Refund to Buyer (Lot rejected due to severe defect)'}
                        </option>
                      </select>
                    </div>

                    {resolutionStatus === 'RESOLVED_PARTIAL_SETTLEMENT' && (
                      <div>
                        <label className="block text-xs font-semibold text-agro-muted mb-1">
                          {isMr ? 'परतावा रक्कम (₹)' : 'Adjustment / Refund Amount (₹)'}
                        </label>
                        <input
                          type="number"
                          value={refundAmount}
                          onChange={e => setRefundAmount(Number(e.target.value))}
                          className="w-full p-2.5 rounded-lg border border-agro-border bg-agro-bg text-agro-text text-sm"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-agro-muted mb-1">
                        {isMr ? 'नियामक शेरा व निर्णय कारण' : 'Regulatory Finding & Legal Rationale'}
                      </label>
                      <textarea
                        rows={3}
                        value={resolutionNotes}
                        onChange={e => setResolutionNotes(e.target.value)}
                        placeholder={isMr ? 'लवाद निकाल आणि कृषी निरीक्षक तपासणी शेरा येथे नोंदवा...' : 'Enter arbitrated findings, mandi inspector verification notes...'}
                        className="w-full p-2.5 rounded-lg border border-agro-border bg-agro-bg text-agro-text text-sm"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDispute(null)}
                        className="px-4 py-2 border border-agro-border text-agro-muted hover:text-agro-text text-sm font-semibold rounded-lg"
                      >
                        {isMr ? 'रद्द करा' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow-md transition-all"
                      >
                        {actionLoading ? (isMr ? 'निर्णय लागू होत आहे...' : 'Executing Ruling...') : (isMr ? 'लवाद निर्णय निश्चित करा' : 'Confirm Arbitrated Ruling')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: KYC & STAKEHOLDER TRUST */}
      {activeTab === 'kyc' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-agro-text">
                {isMr ? 'FPO व खरेदीदार केवायसी व विश्वास पात्रता पडताळणी' : 'Stakeholder KYC & Evidence-Based Trust Verification'}
              </h2>
              <p className="text-sm text-agro-muted">
                {isMr
                  ? 'नोंदणीकृत शेतकरी उत्पादक कंपन्यांची (FPO) व खरेदीदारांची कायदेशीर कागदपत्रे तपासा.'
                  : 'Audit FPC registration, GSTIN, cold storage facilities, and assign Gold/Silver Trust Badges.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FPO 1 */}
            <div className="bg-agro-card border border-agro-border rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    {isMr ? 'सुवर्ण प्रमाणित FPC' : 'GOLD VERIFIED FPC'}
                  </span>
                  <h3 className="text-lg font-bold text-agro-text mt-2">
                    {tEntity('Shivneri Agri Farmers Producer Co.', language)}
                  </h3>
                  <p className="text-xs text-agro-muted">
                    {tMandi('Narayangaon Hub, Junnar, Pune', language)} | Reg: U01409PN2018PTC178942
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-600">94/100</div>
                  <div className="text-[10px] text-agro-muted uppercase font-bold">{isMr ? 'विश्वासार्हता गुण' : 'Trust Score'}</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-agro-bg p-3 rounded-lg border border-agro-border">
                <div>
                  <span className="text-agro-muted">{isMr ? 'क्षमता:' : 'Capacity:'}</span>
                  <div className="font-semibold text-agro-text">{isMr ? '५०० क्विंटल/आठवडा' : '500 Q/week'}</div>
                </div>
                <div>
                  <span className="text-agro-muted">{isMr ? 'पूर्ण सौदे:' : 'Trades Done:'}</span>
                  <div className="font-semibold text-agro-text">{isMr ? '१२८ यशस्वी' : '128 Completed'}</div>
                </div>
                <div>
                  <span className="text-agro-muted">{isMr ? 'तक्रार दर:' : 'Dispute Rate:'}</span>
                  <div className="font-semibold text-emerald-600">{isMr ? '०.७% (अतिशय कमी)' : '0.7% (Low Risk)'}</div>
                </div>
                <div>
                  <span className="text-agro-muted">{isMr ? 'साठवणूक:' : 'Facility:'}</span>
                  <div className="font-semibold text-agro-text">{isMr ? '५०० मे.टन कांदा चाळ' : '500 MT Ventilated Chawl'}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleVerifyUser('usr_fpo_01', true)}
                  className="px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-semibold rounded-lg border border-emerald-500/30 transition-all"
                >
                  ✓ {isMr ? 'सुवर्ण श्रेणी पुनर्प्रमाणित करा' : 'Re-Certify Gold Tier'}
                </button>
              </div>
            </div>

            {/* Buyer 1 */}
            <div className="bg-agro-card border border-agro-border rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                    {isMr ? 'प्रमाणित संस्थात्मक खरेदीदार' : 'VERIFIED INSTITUTIONAL BUYER'}
                  </span>
                  <h3 className="text-lg font-bold text-agro-text mt-2">
                    {tEntity('Sahyadri Fresh Wholesale Pvt Ltd', language)}
                  </h3>
                  <p className="text-xs text-agro-muted">
                    {tMandi('Pune Market Yard, Gultekdi', language)} | GSTIN: 27AABCS1429B1Z8
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-blue-600">92/100</div>
                  <div className="text-[10px] text-agro-muted uppercase font-bold">{isMr ? 'विश्वासार्हता गुण' : 'Trust Score'}</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-agro-bg p-3 rounded-lg border border-agro-border">
                <div>
                  <span className="text-agro-muted">{isMr ? 'खरेदीदार प्रकार:' : 'Buyer Type:'}</span>
                  <div className="font-semibold text-agro-text">{isMr ? 'सुपरमार्केट पुरवठादार' : 'Supermarket Supplier'}</div>
                </div>
                <div>
                  <span className="text-agro-muted">{isMr ? 'एस्क्रो पालन:' : 'Escrow Adherence:'}</span>
                  <div className="font-semibold text-emerald-600">{isMr ? '१००% आगाऊ जमा' : '100% Upfront Funding'}</div>
                </div>
                <div>
                  <span className="text-agro-muted">{isMr ? 'वेळेवर मुक्ती:' : 'On-Time Release:'}</span>
                  <div className="font-semibold text-agro-text">98.4%</div>
                </div>
                <div>
                  <span className="text-agro-muted">{isMr ? 'पेमेंट सुरक्षा:' : 'Payment Security:'}</span>
                  <div className="font-semibold text-agro-text">{isMr ? 'प्रमाणित बँक एस्क्रो' : 'Verified Bank Escrow'}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleVerifyUser('usr_buyer_01', true)}
                  className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-semibold rounded-lg border border-blue-500/30 transition-all"
                >
                  ✓ {isMr ? 'केवायसी स्थिती निश्चित करा' : 'Confirm KYC Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: APMC FEEDS & MANDIS */}
      {activeTab === 'market_feeds' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-agro-text">
                {isMr ? 'APMC बाजारपेठ डेटा संकलन मॉनिटर' : 'Agmarknet APMC Ingestion & Mandi Feeds'}
              </h2>
              <p className="text-sm text-agro-muted">
                {isMr
                  ? 'महाराष्ट्रभरातील प्रमुख बाजार समित्यांचे थेट दर, आवक व सेस उपकर देखरेख.'
                  : 'Real-time arrival volumes, modal prices, and mandi cess tracking across Maharashtra APMC clusters.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { mandi: 'Pune Gultekdi', arrivals: '4,250 Q', status: 'LIVE_SYNC', cess: '1.05%', modal: '₹2,800/q' },
              { mandi: 'Narayangaon', arrivals: '3,100 Q', status: 'LIVE_SYNC', cess: '1.00%', modal: '₹2,780/q' },
              { mandi: 'Baramati APMC', arrivals: '2,800 Q', status: 'LIVE_SYNC', cess: '1.00%', modal: '₹2,720/q' },
              { mandi: 'Khed (Chakan)', arrivals: '3,400 Q', status: 'LIVE_SYNC', cess: '1.05%', modal: '₹2,810/q' }
            ].map(m => (
              <div key={m.mandi} className="bg-agro-card border border-agro-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-agro-text">{tMandi(m.mandi, language)}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                    ● {isMr ? 'थेट डेटा' : m.status}
                  </span>
                </div>
                <div className="mt-3 text-xl font-bold text-agro-text">{m.modal}</div>
                <div className="mt-2 text-xs text-agro-muted flex justify-between">
                  <span>{isMr ? 'आवक:' : 'Arrivals:'} <strong>{m.arrivals}</strong></span>
                  <span>{isMr ? 'सेस:' : 'Cess:'} <strong>{m.cess}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-agro-text">
                {isMr ? 'नियामक व प्रशासकीय ऑडिट लॉग्स' : 'Regulatory Audit Trail'}
              </h2>
              <p className="text-sm text-agro-muted">
                {isMr
                  ? 'प्लॅटफॉर्मवर घडलेल्या सर्व कायदेशीर व प्रशासकीय क्रियांची नोंद.'
                  : 'Immutable record of platform arbitrations, KYC audits, and system sync events.'}
              </p>
            </div>
          </div>

          <div className="bg-agro-card border border-agro-border rounded-xl p-6 shadow-sm">
            <div className="space-y-4">
              {logs.map(log => (
                <div key={log.id} className="p-4 bg-agro-bg rounded-xl border border-agro-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span className="text-xs text-agro-muted">{isMr ? 'नोंदवले:' : 'by'} {tEntity(log.performedBy, language)}</span>
                    </div>
                    <p className="text-xs text-agro-text mt-1">
                      Target: <code className="text-indigo-400">{log.targetId}</code> | Details: {JSON.stringify(log.details)}
                    </p>
                  </div>
                  <div className="text-xs text-agro-muted whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;
