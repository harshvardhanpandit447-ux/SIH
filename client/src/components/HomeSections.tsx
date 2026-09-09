import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HeroAgricultureCanvas } from './HeroAgricultureCanvas';
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Package,
  Truck,
  Building2,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Scale,
  Search,
  Warehouse,
  Coins,
  ChevronRight,
  Eye,
  Sprout
} from 'lucide-react';

interface HomeSectionsProps {
  onNavigate: (view: string) => void;
  onQuickDemo: (role: 'FARMER' | 'FPO' | 'BUYER') => void;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({ onNavigate, onQuickDemo }) => {
  const { language, t } = useLanguage();

  // Net Realisation interactive preview state
  const [grossPrice, setGrossPrice] = useState<number>(2800);
  const [transportCost, setTransportCost] = useState<number>(80);
  const [storageCost, setStorageCost] = useState<number>(40);
  const [handlingCost, setHandlingCost] = useState<number>(20);
  const [spoilageLoss, setSpoilageLoss] = useState<number>(100);

  const totalDeductions = transportCost + storageCost + handlingCost + 25 + spoilageLoss;
  const netRealisation = Math.max(0, grossPrice - totalDeductions);
  const fpoNetRealisation = Math.max(0, grossPrice - (transportCost * 0.55 + storageCost * 0.7 + handlingCost * 0.5 + 25 + spoilageLoss * 0.6));

  return (
    <div className="w-full">
      {/* ===================================================================
          SECTION 2: HERO SECTION
          Cinematic agriculture motion background with layered clean UI above it.
          Strictly NO price predictor in hero.
          =================================================================== */}
      <section className="relative min-h-[640px] flex items-center justify-center pt-8 pb-20 overflow-hidden">
        {/* Recreated Dribbble-style agriculture background canvas */}
        <HeroAgricultureCanvas />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Subtle Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-agro-bright/50 shadow-sm text-agro-dark text-xs font-bold mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="flex h-2 w-2 rounded-full bg-agro-primary animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-agro-primary" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-agro-text tracking-tight leading-[1.15] mb-6">
            {t('hero.headline')}
          </h1>

          {/* Supporting Text */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-agro-text/80 font-normal leading-relaxed mb-10">
            {t('hero.subtext')}
          </p>

          {/* Dual CTAs (Both toggle with Marathi language) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
            <button
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-2xl bg-agro-primary hover:bg-agro-dark text-white font-bold text-base shadow-lg shadow-agro-primary/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>{t('hero.getStarted')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-2xl bg-white/90 hover:bg-white text-agro-dark font-bold text-base border border-agro-light shadow-md transition-all flex items-center justify-center"
            >
              {t('hero.howItWorks')}
            </a>
          </div>

          {/* Mobile-First Quick Feature Hub: Large touch cards to easily identify important features */}
          <div className="w-full max-w-4xl mx-auto mb-8 text-left">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-agro-primary" />
                {language === 'mr' ? 'मोबाईल मुख्य साधने' : 'Quick Mobile Features'}
              </span>
              <span className="text-[11px] text-gray-500 font-medium">
                {language === 'mr' ? '१-टॅप थेट वापर' : '1-Tap Direct Access'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              {/* Card 1: Mandi Rates */}
              <a
                href="#market-intelligence"
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-emerald-200/90 shadow-sm active:bg-emerald-50 hover:border-agro-primary transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-agro-primary flex items-center justify-center mb-2 font-bold group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-agro-text">
                    {language === 'mr' ? 'बाजारभाव' : 'Mandi Rates'}
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-tight">
                    {language === 'mr' ? 'कांदा ₹२,८०० • अंदाज' : 'Live Pune APMC Rates'}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 mt-2 flex items-center gap-0.5">
                  {language === 'mr' ? 'तपासा' : 'Check'} →
                </span>
              </a>

              {/* Card 2: AI Quality Scan */}
              <a
                href="#ai-quality-hub"
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-blue-200/90 shadow-sm active:bg-blue-50 hover:border-blue-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 font-bold group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-agro-text">
                    {language === 'mr' ? 'AI प्रतवारी' : 'AI Quality'}
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-tight">
                    {language === 'mr' ? 'Grade A/B गुणवत्ता' : 'Computer Vision Scan'}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-blue-700 mt-2 flex items-center gap-0.5">
                  {language === 'mr' ? 'स्कॅन करा' : 'Scan'} →
                </span>
              </a>

              {/* Card 3: Net Return Calculator */}
              <a
                href="#net-realisation-calculator"
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-amber-200/90 shadow-sm active:bg-amber-50 hover:border-amber-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 font-bold group-hover:scale-105 transition-transform">
                    <Coins className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-agro-text">
                    {language === 'mr' ? 'निव्वळ नफा' : 'Net Return'}
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-tight">
                    {language === 'mr' ? 'वाहतूक व दलाली कपात' : 'Deduction Calculator'}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-amber-700 mt-2 flex items-center gap-0.5">
                  {language === 'mr' ? 'हिशोब करा' : 'Calculate'} →
                </span>
              </a>

              {/* Card 4: Farmer Aggregation */}
              <a
                href="#how-it-works"
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-teal-200/90 shadow-sm active:bg-teal-50 hover:border-teal-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2 font-bold group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-agro-text">
                    {language === 'mr' ? 'FPO गट' : 'FPO Pooling'}
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-tight">
                    {language === 'mr' ? 'शेतकरी एकत्र विक्री' : 'Group Bulk Lots'}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-teal-700 mt-2 flex items-center gap-0.5">
                  {language === 'mr' ? 'प्रक्रिया पहा' : 'Explore'} →
                </span>
              </a>
            </div>
          </div>

          {/* Trust Metric Strip */}
          <div className="inline-flex flex-wrap items-center justify-center gap-6 sm:gap-10 px-6 py-3 rounded-2xl bg-white/90 border border-agro-light/80 shadow-md backdrop-blur-sm text-xs sm:text-sm font-bold text-agro-dark">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>🌾 {t('hero.activeFarmers')}</span>
            </div>
            <div className="hidden sm:block text-agro-light">|</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>🏢 {t('hero.fposPartnered')}</span>
            </div>
            <div className="hidden sm:block text-agro-light">|</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>📍 {t('hero.puneCluster')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 3: PROBLEM SECTION
          4 Main Cards: Fragmented Prices, Limited Aggregation, Quality Uncertainty, Logistics Losses
          =================================================================== */}
      <section id="problem-solution" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-agro-text tracking-tight mb-4">
              {t('problems.title')}
            </h2>
            <p className="text-lg text-agro-text/70">
              {t('problems.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-3xl bg-agro-bg border border-agro-light/90 hover:border-agro-primary/50 transition-all hover:-translate-y-1 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-agro-text mb-3">{t('problems.p1_title')}</h3>
              <p className="text-sm text-agro-text/75 leading-relaxed">{t('problems.p1_desc')}</p>
            </div>

            <div className="p-8 rounded-3xl bg-agro-bg border border-agro-light/90 hover:border-agro-primary/50 transition-all hover:-translate-y-1 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <Scale className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-agro-text mb-3">{t('problems.p2_title')}</h3>
              <p className="text-sm text-agro-text/75 leading-relaxed">{t('problems.p2_desc')}</p>
            </div>

            <div className="p-8 rounded-3xl bg-agro-bg border border-agro-light/90 hover:border-agro-primary/50 transition-all hover:-translate-y-1 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-agro-text mb-3">{t('problems.p3_title')}</h3>
              <p className="text-sm text-agro-text/75 leading-relaxed">{t('problems.p3_desc')}</p>
            </div>

            <div className="p-8 rounded-3xl bg-agro-bg border border-agro-light/90 hover:border-agro-primary/50 transition-all hover:-translate-y-1 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-agro-text mb-3">{t('problems.p4_title')}</h3>
              <p className="text-sm text-agro-text/75 leading-relaxed">{t('problems.p4_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 4: SOLUTION SECTION (ONE PLATFORM. THREE KEY STAKEHOLDERS)
          Clear architectural workflow: Farmer → FPO → Verified Buyer
          =================================================================== */}
      <section className="py-20 bg-agro-mint border-y border-agro-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-agro-primary mb-2 block">
              {t('solution.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-agro-text tracking-tight mb-4">
              {t('solution.title')}
            </h2>
            <p className="text-lg text-agro-text/70">
              {t('solution.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-stretch">
            {/* Stakeholder 1: Farmer */}
            <div className="bg-white rounded-3xl p-8 border-2 border-agro-light shadow-md flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-agro-dark flex items-center justify-center font-extrabold text-xl mb-6">
                  🌾
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-agro-primary mb-1">Step A</div>
                <h3 className="text-2xl font-bold text-agro-text mb-3">{t('solution.farmer_title')}</h3>
                <p className="text-sm text-agro-text/80 leading-relaxed mb-6">
                  {t('solution.farmer_desc')}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-agro-dark">
                <span>Submits to Designated FPO</span>
                <ChevronRight className="w-4 h-4 text-agro-primary" />
              </div>
            </div>

            {/* Stakeholder 2: FPO (The Crucial Intermediary) */}
            <div className="bg-gradient-to-b from-white to-emerald-50/70 rounded-3xl p-8 border-2 border-agro-primary shadow-xl flex flex-col justify-between relative scale-105">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-agro-primary text-white text-[11px] font-extrabold uppercase tracking-wider shadow">
                Mandatory Bridge & Aggregator
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-agro-primary text-white flex items-center justify-center font-extrabold text-xl mb-6 shadow-md shadow-agro-primary/25">
                  🏢
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-agro-primary mb-1">Step B</div>
                <h3 className="text-2xl font-bold text-agro-text mb-3">{t('solution.fpo_title')}</h3>
                <p className="text-sm text-agro-text/80 leading-relaxed mb-6">
                  {t('solution.fpo_desc')}
                </p>
              </div>
              <div className="pt-4 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-agro-primary">
                <span>Aggregates into Certified Lots</span>
                <ChevronRight className="w-4 h-4 text-agro-primary" />
              </div>
            </div>

            {/* Stakeholder 3: Buyer */}
            <div className="bg-white rounded-3xl p-8 border-2 border-agro-light shadow-md flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-extrabold text-xl mb-6">
                  🛒
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Step C</div>
                <h3 className="text-2xl font-bold text-agro-text mb-3">{t('solution.buyer_title')}</h3>
                <p className="text-sm text-agro-text/80 leading-relaxed mb-6">
                  {t('solution.buyer_desc')}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-agro-dark">
                <span>Contracts Directly with FPO</span>
                <CheckCircle2 className="w-4 h-4 text-agro-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 5: HOW IT WORKS (5-STEP VISUAL PROCESS)
          01 Farmer Adds Produce -> 02 FPO Aggregates -> 03 AI & Intel -> 04 FPO Matches -> 05 Deal & Pay
          =================================================================== */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-agro-text tracking-tight mb-4">
              {t('howItWorks.title')}
            </h2>
            <p className="text-lg text-agro-text/70">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                num: '01',
                title: t('howItWorks.step1_title'),
                desc: t('howItWorks.step1_desc'),
                icon: Package,
                color: 'bg-emerald-50 text-agro-primary'
              },
              {
                num: '02',
                title: t('howItWorks.step2_title'),
                desc: t('howItWorks.step2_desc'),
                icon: Building2,
                color: 'bg-emerald-50 text-agro-primary'
              },
              {
                num: '03',
                title: t('howItWorks.step3_title'),
                desc: t('howItWorks.step3_desc'),
                icon: TrendingUp,
                color: 'bg-blue-50 text-blue-600'
              },
              {
                num: '04',
                title: t('howItWorks.step4_title'),
                desc: t('howItWorks.step4_desc'),
                icon: Search,
                color: 'bg-amber-50 text-amber-600'
              },
              {
                num: '05',
                title: t('howItWorks.step5_title'),
                desc: t('howItWorks.step5_desc'),
                icon: ShieldCheck,
                color: 'bg-emerald-100 text-agro-dark'
              }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-agro-bg border border-agro-light/80 hover:border-agro-primary/40 transition-all hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-agro-bright">{step.num}</span>
                      <div className={`p-2.5 rounded-xl ${step.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-agro-text mb-2">{step.title}</h3>
                    <p className="text-xs text-agro-text/75 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 6: MARKET INTELLIGENCE & NET REALISATION SECTION
          Shows the Net Realisation calculator and AI price forecasting preview
          =================================================================== */}
      <section id="market-intelligence" className="py-20 bg-agro-bg border-y border-agro-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-agro-primary mb-2 block">
              {language === 'mr' ? 'अचूक अर्थकारण' : 'Transparent Agrinomics'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-agro-text tracking-tight mb-4">
              {t('marketIntel.title')}
            </h2>
            <p className="text-lg text-agro-text/70">
              {t('marketIntel.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Net Realisation Formula & Interactive Calculator */}
            <div id="net-realisation-calculator" className="lg:col-span-7 bg-white rounded-3xl p-8 border border-agro-light shadow-md scroll-mt-24">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-agro-mint text-agro-primary flex items-center justify-center">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-agro-text">{t('marketIntel.calculatorTitle')}</h3>
                    <p className="text-xs text-gray-500">
                      {language === 'mr' ? 'एकूण भाव वजा वाहतूक, साठवणूक आणि घट' : 'Gross Selling Price minus Transport, Storage & Losses'}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-agro-dark text-xs font-extrabold">
                  {language === 'mr' ? 'कांदा (पुणे)' : 'Onion (Pune)'}
                </span>
              </div>

              {/* Slider Inputs */}
              <div className="space-y-4 mb-8">
                <div>
                  <div className="flex justify-between text-xs font-bold text-agro-dark mb-1">
                    <span>{t('marketIntel.grossPrice')}:</span>
                    <span className="text-agro-primary font-black text-sm">₹{grossPrice} / q</span>
                  </div>
                  <input
                    type="range"
                    min="1500"
                    max="4500"
                    step="50"
                    value={grossPrice}
                    onChange={e => setGrossPrice(Number(e.target.value))}
                    className="w-full accent-agro-primary cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                      <span>{t('marketIntel.transportCost')}:</span>
                      <span>₹{transportCost}/q</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="200"
                      value={transportCost}
                      onChange={e => setTransportCost(Number(e.target.value))}
                      className="w-full accent-agro-primary cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                      <span>{t('marketIntel.storageCost')}:</span>
                      <span>₹{storageCost}/q</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="150"
                      value={storageCost}
                      onChange={e => setStorageCost(Number(e.target.value))}
                      className="w-full accent-agro-primary cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                      <span>{t('marketIntel.handlingCost')}:</span>
                      <span>₹{handlingCost}/q</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={handlingCost}
                      onChange={e => setHandlingCost(Number(e.target.value))}
                      className="w-full accent-agro-primary cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                      <span>{t('marketIntel.spoilageRisk')}:</span>
                      <span>₹{spoilageLoss}/q</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="250"
                      value={spoilageLoss}
                      onChange={e => setSpoilageLoss(Number(e.target.value))}
                      className="w-full accent-agro-primary cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Comparison Card: Solo Farm-gate vs FPO Aggregated */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="text-xs font-bold text-gray-500 uppercase">
                    {language === 'mr' ? 'एकट्या शेतकऱ्याची विक्री' : 'Individual Solo Sale'}
                  </div>
                  <div className="text-2xl font-black text-gray-800 my-1">
                    ₹{netRealisation} <span className="text-xs font-normal">/ q</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {language === 'mr' ? 'एकूण वजावटी: ₹' + totalDeductions : `Total Deductions: ₹${totalDeductions}/q`}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-agro-mint border-2 border-agro-primary">
                  <div className="text-xs font-bold text-agro-dark uppercase flex items-center justify-between">
                    <span>{language === 'mr' ? 'FPO एकत्रीकरणाद्वारे विक्री' : 'Via FPO Aggregation'}</span>
                    <span className="px-1.5 py-0.5 rounded bg-agro-primary text-white text-[10px]">
                      +{Math.round(fpoNetRealisation - netRealisation)} ₹/q
                    </span>
                  </div>
                  <div className="text-2xl font-black text-agro-dark my-1">
                    ₹{Math.round(fpoNetRealisation)} <span className="text-xs font-normal">/ q</span>
                  </div>
                  <p className="text-[11px] text-agro-dark/80 font-medium">
                    {language === 'mr' ? 'वाहतूक बचत आणि थेट संस्थात्मक खरेदी' : 'Saved bulk transport & zero middleman cut'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: ML Price Range & Recommendation Preview */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-agro-light shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-agro-primary" />
                    <h4 className="font-bold text-agro-text">{t('marketIntel.predictedPrice')}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                    85% {t('marketIntel.confidence')}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-agro-bright/40 mb-4">
                  <div className="text-xs text-agro-dark/70 font-semibold mb-1">
                    {language === 'mr' ? 'पुणे बाजारपेठ (पुढील ३ आठवडे अंदाज)' : 'Pune APMC (3-Week Forecast Range)'}
                  </div>
                  <div className="text-3xl font-extrabold text-agro-dark">
                    ₹3,050 – ₹3,180 <span className="text-sm font-medium">/ q</span>
                  </div>
                  <div className="text-xs text-emerald-700 font-bold mt-1 flex items-center gap-1">
                    <span>▲ +10.5% Expected Price Momentum</span>
                  </div>
                </div>

                {/* Sell Now vs Wait vs Store Badge */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-extrabold text-xs uppercase">
                      {t('marketIntel.store')}
                    </span>
                    <span className="text-xs font-bold text-amber-900">
                      {language === 'mr' ? 'गोदामात साठवणूक फायदेशीर' : 'FPO Storage Recommended'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/80 leading-relaxed">
                    {language === 'mr'
                      ? 'भाववाढ (+₹२८०) ही साठवणूक आणि घट खर्चापेक्षा जास्त आहे. FPO गोदामात २ आठवडे माल ठेवल्यास अधिक निव्वळ परतावा मिळेल.'
                      : 'Projected price rise comfortably exceeds warehouse holding costs & moisture loss. Storing through FPO yields highest net realisation.'}
                  </p>
                </div>
              </div>

              {/* Preliminary Quality AI Hub */}
              <div id="ai-quality-hub" className="bg-white rounded-3xl p-6 border border-agro-light shadow-md scroll-mt-24">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-agro-primary/10 text-agro-primary flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">{t('aiQuality.title')}</div>
                    <div className="font-bold text-agro-text text-sm">Computer Vision Grade A (92% Confidence)</div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {language === 'mr' ? 'FPO प्रत्यक्ष पडताळणीसह अंतिम प्रमाणीकरण' : 'Subject to FPO physical verification'}
                    </p>
                  </div>
                </div>

                {/* Mobile Quick Quality Probe */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">
                    {language === 'mr' ? '📸 मोबाईल कॅमेरा स्कॅन चाचणी:' : '📸 Mobile Camera Quality Scan:'}
                  </span>
                  <button
                    onClick={() => onQuickDemo('FARMER')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold active:scale-95 transition-all flex items-center gap-1"
                  >
                    <span>{language === 'mr' ? 'थेट चाचणी करा' : 'Try AI Scan'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTIONS 7, 8, 9: FARMER, FPO, BUYER DEDICATED SECTIONS
          =================================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-agro-text tracking-tight mb-4">
              {language === 'mr' ? 'प्रत्येक घटकासाठी विशेष लाभ' : 'Tailored for Every Agricultural Stakeholder'}
            </h2>
            <p className="text-lg text-agro-text/70">
              {language === 'mr' ? 'शेतकरी, FPO आणि खरेदीदार प्रत्येकासाठी विशिष्ट साधने' : 'Dedicated tools and portals built for specialized stakeholder requirements'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Farmer Card */}
            <div className="p-8 rounded-3xl bg-agro-bg border border-agro-light flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-4">🌾</div>
                <h3 className="text-2xl font-bold text-agro-text mb-3">{t('roles.farmer')}</h3>
                <ul className="space-y-3 text-sm text-agro-text/80 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agro-primary shrink-0 mt-0.5" />
                    <span>No upfront commodity registration friction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agro-primary shrink-0 mt-0.5" />
                    <span>Instant AI quality scan & preliminary grade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agro-primary shrink-0 mt-0.5" />
                    <span>True Net Realisation calculation before selling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agro-primary shrink-0 mt-0.5" />
                    <span>Direct submission to verified local Pune FPO</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onQuickDemo('FARMER')}
                className="w-full py-3 px-4 rounded-xl bg-white border border-agro-bright text-agro-dark font-bold text-sm hover:bg-agro-mint transition-colors"
              >
                ⚡ Explore Farmer Portal
              </button>
            </div>

            {/* FPO Card */}
            <div className="p-8 rounded-3xl bg-agro-mint border-2 border-agro-primary flex flex-col justify-between shadow-md">
              <div>
                <div className="text-3xl mb-4">🏢</div>
                <h3 className="text-2xl font-bold text-agro-text mb-3">{t('roles.fpo')}</h3>
                <ul className="space-y-3 text-sm text-agro-text/80 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agro-primary shrink-0 mt-0.5" />
                    <span>Aggregate farmer yields into bulk commercial lots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agro-primary shrink-0 mt-0.5" />
                    <span>Algorithmic matching with verified institutional buyers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agro-primary shrink-0 mt-0.5" />
                    <span>Bilateral price negotiation and contract generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-agro-primary shrink-0 mt-0.5" />
                    <span>Automated farmer payout distribution via escrow</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onQuickDemo('FPO')}
                className="w-full py-3 px-4 rounded-xl bg-agro-primary text-white font-bold text-sm hover:bg-agro-dark transition-colors shadow-sm"
              >
                ⚡ Explore FPO Portal
              </button>
            </div>

            {/* Buyer Card */}
            <div className="p-8 rounded-3xl bg-agro-bg border border-agro-light flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-4">🛒</div>
                <h3 className="text-2xl font-bold text-agro-text mb-3">{t('roles.buyer')}</h3>
                <ul className="space-y-3 text-sm text-agro-text/80 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Procure certified Grade A/B lots directly from FPOs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Post forward requirements with specific delivery dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Reliable FPO Trust Score and trade completion record</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Live GPS dispatch and escrow release security</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onQuickDemo('BUYER')}
                className="w-full py-3 px-4 rounded-xl bg-white border border-agro-bright text-agro-dark font-bold text-sm hover:bg-agro-mint transition-colors"
              >
                ⚡ Explore Buyer Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 10: TRUST & TRANSPARENCY SCORE
          =================================================================== */}
      <section className="py-16 bg-agro-mint/60 border-t border-agro-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-agro-light shadow-md flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-agro-dark text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4 text-agro-primary" />
                <span>{t('trust.verifiedFpc')}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-agro-text mb-3">
                {t('trust.title')}
              </h3>
              <p className="text-sm text-agro-text/75 leading-relaxed mb-6">
                {t('trust.subtitle')}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-agro-dark">
                <div className="p-3 rounded-xl bg-agro-bg border border-agro-light">
                  ✓ {t('trust.criteria1')}
                </div>
                <div className="p-3 rounded-xl bg-agro-bg border border-agro-light">
                  ✓ {t('trust.criteria2')}
                </div>
                <div className="p-3 rounded-xl bg-agro-bg border border-agro-light">
                  ✓ {t('trust.criteria3')}
                </div>
                <div className="p-3 rounded-xl bg-agro-bg border border-agro-light">
                  ✓ {t('trust.criteria4')}
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-tr from-agro-dark to-emerald-900 text-white text-center shadow-xl shrink-0 w-64">
              <div className="text-xs uppercase tracking-widest text-emerald-300 font-bold mb-1">
                Shivneri FPC Rating
              </div>
              <div className="text-6xl font-black my-2 text-white">94</div>
              <div className="text-xs text-emerald-200 font-semibold">
                / 100 {t('trust.scoreLabel')}
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-700/50 text-[11px] text-emerald-300">
                128 Completed Bilateral Trades
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 11: LOGISTICS & STORAGE SECTION
          =================================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-agro-primary mb-2 block">
                {language === 'mr' ? 'कोल्ड स्टोरेज आणि वाहतूक' : 'Cold Chain & Fleet'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-agro-text tracking-tight mb-4">
                {language === 'mr' ? 'विना-नुकसान एकात्मिक वाहतूक आणि साठवणूक' : 'Loss-Minimized Storage & Integrated Transit'}
              </h2>
              <p className="text-base text-agro-text/75 leading-relaxed mb-6">
                {language === 'mr'
                  ? 'पुणे जिल्ह्यातील नारायणगाव, बारामती आणि खेड येथील एफपीओ गोदामांमध्ये शीतगृह सुविधा उपलब्ध आहे. यातून नाशवंत मालाचे नुकसान २५% वरून अवघ्या ३% वर आणले जाते.'
                  : 'Direct FPO aggregation facilities across Narayangaon, Baramati, and Khed integrate pre-cooling chambers, ventilated onion chawls, and verified refrigerated transport, cutting post-harvest losses from 25% down to under 4%.'}
              </p>
              <div className="space-y-3 text-sm font-semibold text-agro-dark">
                <div className="flex items-center gap-3">
                  <Warehouse className="w-5 h-5 text-agro-primary" />
                  <span>500 MT Ventilated Onion Chawl & Cold Hub at Narayangaon</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-agro-primary" />
                  <span>GPS Dispatched Route with Real-Time Temperature Telemetry</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-agro-mint border border-agro-light flex flex-col justify-center">
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-agro-bright/40">
                <div className="text-3xl font-extrabold text-agro-dark mb-1">₹75 / Quintal</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Standard Pune District Aggregated Transit
                </div>
                <div className="mt-4 text-xs text-agro-text/80 bg-agro-bg p-3 rounded-xl">
                  {language === 'mr'
                    ? 'एकत्रित वाहतुकीमुळे शेतकऱ्यांचा प्रति क्विंटल ४०% खर्च वाचतो.'
                    : 'FPO batch transit reduces individual freight rates by 40% vs private farm pick-up.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 12: FINAL CALL TO ACTION (CTA)
          =================================================================== */}
      <section className="py-20 bg-gradient-to-tr from-agro-dark via-emerald-950 to-agro-dark text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {language === 'mr'
              ? 'आजच ऍग्रो व्हिजन मंचाशी जोडले जा'
              : 'Join the AGRO VISION Ecosystem Today'}
          </h2>
          <p className="text-base sm:text-lg text-emerald-200 max-w-2xl mx-auto mb-10">
            {language === 'mr'
              ? 'शेतकरी, FPO आणि खरेदीदारांसाठी पारदर्शक कृषी बाजारपेठेत सहभागी व्हा.'
              : 'Empowering farmers with predictive market intelligence and fair prices through certified FPO aggregation.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onQuickDemo('FARMER')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-agro-primary hover:bg-agro-bright text-white font-bold text-sm transition-all"
            >
              🌾 {language === 'mr' ? 'शेतकरी म्हणून सहभागी व्हा' : 'Register as Farmer'}
            </button>
            <button
              onClick={() => onQuickDemo('FPO')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-agro-dark hover:bg-agro-mint font-bold text-sm transition-all"
            >
              🏢 {language === 'mr' ? 'FPO नोंदणी करा' : 'Register as FPO'}
            </button>
            <button
              onClick={() => onQuickDemo('BUYER')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-800 text-white hover:bg-emerald-700 font-bold text-sm transition-all"
            >
              🛒 {language === 'mr' ? 'खरेदीदार नोंदणी करा' : 'Register as Buyer'}
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 13: COMPREHENSIVE FOOTER
          =================================================================== */}
      <footer className="bg-white border-t border-agro-light pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-agro-primary text-white flex items-center justify-center font-black">
                  <Sprout className="w-4 h-4" />
                </div>
                <span className="text-xl font-black text-agro-text">AGRO <span className="text-agro-primary">VISION</span></span>
              </div>
              <p className="text-xs text-agro-text/70 max-w-sm mb-4 leading-relaxed">
                {t('footer.desc')}
              </p>
              <div className="text-xs font-bold text-agro-primary">
                📍 Pune Agri Hub, Narayangaon & Gultekdi Mandi, Maharashtra
              </div>
            </div>

            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-agro-text mb-4">
                {t('footer.quickLinks')}
              </div>
              <ul className="space-y-2 text-xs font-medium text-agro-text/70">
                <li><a href="#how-it-works" className="hover:text-agro-primary">How It Works</a></li>
                <li><a href="#market-intelligence" className="hover:text-agro-primary">Market Intelligence</a></li>
                <li><a href="#problem-solution" className="hover:text-agro-primary">Problem & Solution</a></li>
                <li><a href="#market-intelligence" className="hover:text-agro-primary">Price Predictor</a></li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-agro-text mb-4">
                {t('footer.forFarmers')}
              </div>
              <ul className="space-y-2 text-xs font-medium text-agro-text/70">
                <li><button onClick={() => onQuickDemo('FARMER')} className="hover:text-agro-primary">Farmer Dashboard</button></li>
                <li><button onClick={() => onQuickDemo('FARMER')} className="hover:text-agro-primary">Add Produce</button></li>
                <li><button onClick={() => onQuickDemo('FARMER')} className="hover:text-agro-primary">AI Quality Test</button></li>
                <li><button onClick={() => onQuickDemo('FARMER')} className="hover:text-agro-primary">Pune APMC Rates</button></li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-agro-text mb-4">
                {t('footer.forFpos')} & Buyers
              </div>
              <ul className="space-y-2 text-xs font-medium text-agro-text/70">
                <li><button onClick={() => onQuickDemo('FPO')} className="hover:text-agro-primary">FPO Aggregator</button></li>
                <li><button onClick={() => onQuickDemo('FPO')} className="hover:text-agro-primary">Create Lots</button></li>
                <li><button onClick={() => onQuickDemo('BUYER')} className="hover:text-agro-primary">Buyer Requirements</button></li>
                <li><button onClick={() => onQuickDemo('BUYER')} className="hover:text-agro-primary">Matched Lots</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-agro-text/60 gap-4">
            <div>{t('footer.copyright')}</div>
            <div className="flex items-center gap-6">
              <span>English | मराठी Localized</span>
              <span>Pune Agri Hub Demo</span>
              <span>Strictly Farmer → FPO → Buyer Workflow</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
