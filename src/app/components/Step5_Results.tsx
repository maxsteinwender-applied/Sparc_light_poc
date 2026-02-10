import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useWizard, StrategyType } from './WizardContext';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Shield, TrendingUp, Zap, ChevronRight, Download, Share2, Mail,
  Search, CheckCircle2, Edit2, Lock, Save, Globe, ChevronLeft, ArrowUp
} from 'lucide-react';
import clsx from 'clsx';
import { Radio, RadioGroup } from '@headlessui/react';
import { Button } from './ui/button';
import { getGoal } from './goalsData';
import { formatCurrency } from './ui/utils';

export const Step5_Results = () => {
  const { 
    targetAmount, setTargetAmount, 
    durationYears, setDurationYears, 
    selectedStrategy, setSelectedStrategy,
    goal,
    customGoalName,
    setStep
  } = useWizard();

  const [activeTab, setActiveTab] = useState<'chart' | 'optimize' | 'action'>('chart');
  const [showZeroReturn, setShowZeroReturn] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const currentGoal = getGoal(goal);
  const goalLabel = goal === 'custom' ? (customGoalName || 'Ziel') : currentGoal.label;
  const GoalIcon = currentGoal.icon || Shield;
  const currentYear = new Date().getFullYear();
  const targetYear = currentYear + durationYears;

  // Calculation Logic
  const { monthlySavings, totalInvested, totalReturn, chartData } = useMemo(() => {
    const rate = currentGoal.strategies[selectedStrategy].rate;
    const months = durationYears * 12;
    const monthlyRate = rate / 12;
    
    // PMT Formula: PMT = FV * r / ((1 + r)^n - 1)
    let pmt = 0;
    if (rate === 0) {
      pmt = targetAmount / months;
    } else {
      pmt = (targetAmount * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    const invested = pmt * months;
    const ret = targetAmount - invested;

    // Calculate time needed for 0% return to reach target
    const monthsNeededZero = Math.ceil(targetAmount / pmt);
    const yearsNeededZero = Math.ceil(monthsNeededZero / 12);
    
    // Determine chart duration based on toggle
    const chartDuration = showZeroReturn ? Math.max(durationYears, yearsNeededZero) : durationYears;

    // Generate Chart Data
    const data = [];
    let currentBalance = 0;
    let currentInvested = 0;
    // For 0% comparison line
    let zeroReturnBalance = 0;
    
    const currentYear = new Date().getFullYear();

    for (let i = 0; i <= chartDuration; i++) {
      data.push({
        year: currentYear + i,
        invested: Math.round(currentInvested),
        value: Math.round(currentBalance),
        zeroReturn: Math.round(zeroReturnBalance),
        // Mark the goal points for reference
        isTargetFonds: i === durationYears,
        isTargetZero: i === yearsNeededZero
      });

      // Advance one year
      for (let m = 0; m < 12; m++) {
        // Stop contributing to Fonds strategy after durationYears
        if (i < durationYears) {
           currentBalance = (currentBalance + pmt) * (1 + monthlyRate);
           currentInvested += pmt;
        } else {
           // Continue interest only? Or just flat?
           // Usually we show potential growth if left invested, 
           // but to keep it simple and comparable, let's just let it grow by interest
           currentBalance = currentBalance * (1 + monthlyRate);
        }

        // For Zero return, we assume they keep saving until they hit the target
        if (zeroReturnBalance < targetAmount) {
            zeroReturnBalance += pmt;
        }
      }
    }

    return {
      monthlySavings: Math.ceil(pmt),
      totalInvested: Math.round(invested),
      totalReturn: Math.round(ret),
      chartData: data
    };
  }, [targetAmount, durationYears, selectedStrategy, currentGoal, showZeroReturn]);

  const zeroReturnMonthly = useMemo(() => {
    const months = durationYears * 12;
    return Math.ceil(targetAmount / months);
  }, [durationYears, targetAmount]);

  const monthlyDifference = zeroReturnMonthly - monthlySavings;

  const pdfData = useMemo(() => {
    const strategy = currentGoal.strategies[selectedStrategy];
    return {
      goalLabel,
      dateLabel: new Date().toLocaleDateString('de-DE'),
      targetAmount,
      durationYears,
      targetYear,
      monthlySavings,
      strategyLabel: strategy.label,
      strategyRateLabel: `${(strategy.rate * 100).toFixed(1).replace('.', ',')} % p. a.`,
      totalInvested,
      totalReturn,
      projectedValue: targetAmount,
      zeroReturnMonthly,
      monthlyDifference,
    };
  }, [
    currentGoal,
    durationYears,
    goalLabel,
    monthlyDifference,
    monthlySavings,
    selectedStrategy,
    targetAmount,
    targetYear,
    totalInvested,
    totalReturn,
    zeroReturnMonthly,
  ]);

  const handleExportPdf = async () => {
    if (!pdfContainerRef.current || isExporting) return;

    setIsExporting(true);
    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(pdfContainerRef.current, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;
      const widthScale = maxWidth / canvas.width;
      const heightScale = maxHeight / canvas.height;
      const scale = Math.min(widthScale, heightScale);
      const renderWidth = canvas.width * scale;
      const renderHeight = canvas.height * scale;
      const offsetX = (pageWidth - renderWidth) / 2;
      const offsetY = (pageHeight - renderHeight) / 2;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'FAST');

      const slug = goalLabel
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'ziel';
      const datePart = new Date().toISOString().slice(0, 10);
      pdf.save(`sparplan-${slug}-${datePart}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      window.alert('PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen font-sans relative">
      {/* HERO SECTION */}
      <div className="bg-[#F4F9FA] border-b border-[#003745]/10 pt-8 pb-12 px-4 relative">
        <div className="max-w-6xl mx-auto relative">
          <button 
            onClick={() => setStep(4)}
            className="absolute left-0 top-0 text-[#568996] hover:text-[#003745] flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ChevronLeft size={16} /> Zurück
          </button>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex flex-col items-center pt-8 mb-12"
          >
            <span className="text-[#EE0000] font-medium text-sm tracking-widest uppercase mb-3 block">
              Schritt 5 von 5
            </span>
            <div className="text-[#003745] mb-4">
              <GoalIcon size={48} strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#003745] mb-4 tracking-tight">
              Ihr Ziel "{goalLabel}" wird greifbar.
            </h1>
            <p className="text-xl text-[#568996] font-light max-w-2xl">
              Mit Ihrem Plan erreichen Sie <span className="font-semibold text-[#003745]">{formatCurrency(targetAmount)}</span> in <span className="font-semibold text-[#003745]">{durationYears} Jahren</span>.
            </p>
          </motion.div>

          {/* Overview KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ResultCard 
              label="MONATLICHE SPARRATE" 
              value={formatCurrency(monthlySavings)} 
              highlight 
            />
            
            {/* Editable Duration */}
            <EditableCard 
              label="LAUFZEIT" 
              value={durationYears}
              suffix="Jahre"
              onSave={(val) => setDurationYears(val)}
              min={1} max={40}
            />

            {/* Editable Target */}
            <EditableCard 
              label="ZIELBETRAG" 
              value={targetAmount}
              suffix="EUR"
              onSave={(val) => setTargetAmount(val)}
              step={1000}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        
        {/* STRATEGIES */}
        <section className="bg-[#F5EFE4] rounded-[4px] p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#003745]">Renditeauswahl</h2>
            <button className="text-[#003745] hover:underline text-sm font-medium">
              Eigene Rendite annehmen
            </button>
          </div>
          
          <RadioGroup value={selectedStrategy} onChange={setSelectedStrategy} className="grid md:grid-cols-3 gap-6">
            {(Object.keys(currentGoal.strategies) as StrategyType[]).map((key) => {
              const s = currentGoal.strategies[key];
              return (
                <Radio
                  key={key}
                  value={key}
                  className={({ checked }) => clsx(
                    "cursor-pointer rounded-[4px] p-4 md:p-6 transition-all relative overflow-hidden focus:outline-none",
                    checked 
                      ? "border-2 border-[#003745] bg-[#003745]/10" 
                      : "border border-[#003745]/20 bg-white hover:border-[#003745] shadow-sm"
                  )}
                >
                  {({ checked }) => (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <span className={clsx(
                          "text-[10px] md:text-[11px] font-bold uppercase tracking-wider rounded-full",
                          checked ? "text-[#003745]" : "text-[#568996]"
                        )}>
                          {s.label}
                        </span>
                        {checked && <CheckCircle2 className="text-[#003745]" size={20} />}
                      </div>
                      
                      <h3 className="font-bold text-[#003745] mb-1 text-base md:text-lg">{s.product}</h3>
                      <div className="text-2xl md:text-3xl font-bold text-[#003745] mb-2">
                        ca. {(s.rate * 100).toFixed(1).replace('.', ',')} % <span className="text-sm font-normal text-[#568996]">p. a.</span>
                      </div>
                      <p className="text-xs md:text-sm text-[#568996]">{s.description}</p>
                    </>
                  )}
                </Radio>
              );
            })}
          </RadioGroup>
        </section>

        {/* TABS NAVIGATION */}
        <div className="relative z-40">
          <div ref={sentinelRef} className="absolute -top-px left-0 right-0 h-px" />
          <div 
            className={clsx(
              "sticky top-0 w-full transition-all duration-300 bg-white border-b border-[#E6EEF0]",
              // isSticky state can be used for other effects if needed, but per requirements:
              // - Background solid white (always, since it's primary nav)
              // - Bottom divider (always, full width baseline)
              // - No shadow
            )}
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex gap-12 overflow-x-auto no-scrollbar" role="tablist">
                {[
                  { id: 'chart', label: 'Übersicht' },
                  { id: 'optimize', label: 'Optimierung' },
                  { id: 'action', label: 'Umsetzung' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={clsx(
                      "py-4 text-lg transition-colors relative focus:outline-none whitespace-nowrap group",
                      activeTab === tab.id 
                        ? "text-[#003745] font-semibold" 
                        : "text-[#9FB6BC] font-normal hover:text-[#003745]"
                    )}
                  >
                    {tab.label}
                    
                    {/* Active State Underline */}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-[#EE0000]"
                        initial={false}
                      />
                    )}

                    {/* Hover State Preview */}
                    {activeTab !== tab.id && (
                      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#003745]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {activeTab === 'chart' && (
               <motion.div 
               key="chart"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
             >
               <div className="space-y-12">
                 <section className="bg-white rounded-[4px] border border-[#003745]/10 p-0 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-4 md:px-0 pt-6 md:pt-0">
                    <h2 className="text-2xl font-bold text-[#003745]">Ihr Weg zum Ziel</h2>
                    
                    {/* Chart Toggle */}
                    <div className="flex bg-[#F4F9FA] p-1 rounded-full border border-[#E6EEF0]">
                      <button
                        onClick={() => setShowZeroReturn(false)}
                        className={clsx(
                          "px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                          !showZeroReturn 
                            ? "bg-[#003745] text-white shadow-sm" 
                            : "text-[#568996] hover:text-[#003745]"
                        )}
                      >
                        <div className={clsx("w-2 h-2 rounded-full", !showZeroReturn ? "bg-white" : "bg-transparent border border-current")} />
                        Mit FondsSparplan
                      </button>
                      <button
                        onClick={() => setShowZeroReturn(true)}
                        className={clsx(
                          "px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                          showZeroReturn 
                            ? "bg-[#003745] text-white shadow-sm" 
                            : "text-[#568996] hover:text-[#003745]"
                        )}
                      >
                        <div className={clsx("w-2 h-2 rounded-full", showZeroReturn ? "bg-white" : "bg-transparent border border-current")} />
                        Ohne Rendite (0 %)
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex-grow h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#003745" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#003745" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="0" vertical={false} stroke="#E6EEF0" />
                          <XAxis 
                            dataKey="year" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#568996', fontSize: 12 }}
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#568996', fontSize: 12 }}
                            tickFormatter={(value) => `${value / 1000}k`}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '4px', border: '1px solid #D9E2E5', boxShadow: 'none', color: '#003745' }}
                            itemStyle={{ color: '#003745' }}
                            formatter={(value: number, name: string) => {
                              if (name === 'Gesamtwert' || name === 'FondsSparplan') return [formatCurrency(value), 'FondsSparplan'];
                              if (name === 'Girokonto (0 % Rendite)') return [formatCurrency(value), 'Girokonto (0 %)'];
                              return [formatCurrency(value), name];
                            }}
                            labelStyle={{ color: '#568996', marginBottom: '0.25rem' }}
                          />
                          
                          {/* Primary Fonds Line - Always Visible */}
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            name="FondsSparplan"
                            stroke="#003745" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                            animationDuration={1000}
                          />
                          
                          {/* Zero Return Line - Conditionally Visible */}
                          {showZeroReturn && (
                            <Line 
                              type="monotone" 
                              dataKey="zeroReturn" 
                              name="Girokonto (0 % Rendite)"
                              stroke="#568996" 
                              strokeWidth={2} 
                              strokeDasharray="4 4" 
                              dot={false} 
                              opacity={0.7}
                              animationDuration={1000}
                            />
                          )}

                          {/* Invested Line - Only show in standard view to avoid clutter in comparison */}
                          {!showZeroReturn && (
                            <Line 
                              type="monotone" 
                              dataKey="invested" 
                              name="Eingezahlt"
                              stroke="#568996" 
                              strokeWidth={2} 
                              strokeDasharray="4 4" 
                              dot={false} 
                            />
                          )}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="lg:w-80 shrink-0 space-y-6 px-4 md:px-0 pb-6 md:pb-0">
                      <div className="bg-[#F4F9FA] rounded-[4px] p-6 border border-[#E6EEF0]">
                        <div className="mb-6">
                          <div className="text-sm text-[#568996] mb-1">Investiertes Kapital</div>
                          <div className="text-xl font-semibold text-[#003745]">{formatCurrency(totalInvested)}</div>
                        </div>
                        <div className="mb-6">
                          <div className="text-sm text-[#568996] mb-1">Voraussichtlicher Wert</div>
                          <div className="text-2xl font-bold text-[#003745]">{formatCurrency(targetAmount)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-[#568996] mb-1">Davon Erträge</div>
                          <div className="text-xl font-semibold text-[#3A8F7B]">+{formatCurrency(totalReturn)}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 text-sm text-[#568996]">
                        <div className="flex gap-2">
                          <div className="shrink-0 text-[#003745] bg-[#E6EEF0] rounded-full h-5 w-5 flex items-center justify-center font-bold text-xs">i</div>
                          <p className="leading-relaxed">
                            Das entspricht rund {formatCurrency(Math.round(totalReturn / (durationYears * 12)))} Ertrag pro Monat über die Laufzeit.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                 </section>

                 {/* COMPARISON DETAIL SECTION */}
                 <ComparisonSection 
                   targetAmount={targetAmount}
                   durationYears={durationYears}
                   monthlySavings={monthlySavings}
                   currentYear={currentYear}
                   totalInvested={totalInvested}
                   totalReturn={totalReturn}
                   zeroReturnMonthly={zeroReturnMonthly}
                   monthlyDifference={monthlyDifference}
                 />
               </div>
             </motion.div>
            )}

            {activeTab === 'optimize' && (
              <motion.div 
                key="optimize"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6 text-center text-[#568996]">
                  Wusstest du, dass kleine Anpassungen dein Ziel deutlich schneller erreichbar machen können?
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { 
                      icon: TrendingUp, 
                      title: 'Dynamisierung', 
                      subtitle: '+3 % jährlich', 
                      text: 'Sie erreichen Ihr Ziel ca. 6 Monate früher.' 
                    },
                    { 
                      icon: Shield, 
                      title: 'Inflationsausgleich', 
                      subtitle: 'Kaufkraftsicherung', 
                      text: `${formatCurrency(targetAmount)} heute entsprechen ca. ${formatCurrency(Math.round(targetAmount * 1.17))} in ${durationYears} Jahren.` 
                    },
                    { 
                      icon: Zap, 
                      title: 'Sparraten-Alternative', 
                      subtitle: 'Weniger monatlich', 
                      text: `${formatCurrency(Math.round(monthlySavings * 0.85))} monatlich bei ${durationYears + 2} Jahren Laufzeit.` 
                    }
                  ].map((opt, i) => (
                    <div key={i} className="bg-white p-6 rounded-[4px] border border-[#003745]/20 hover:border-[#003745] transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-[#F4F9FA] p-3 rounded-[4px] text-[#003745] group-hover:bg-[#003745] group-hover:text-white transition-colors">
                          <opt.icon size={24} strokeWidth={1.5} />
                        </div>
                        <div className="bg-[#F4F9FA] rounded-full p-1 text-[#003745] group-hover:bg-[#003745] group-hover:text-white transition-colors">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                      <h3 className="font-bold text-[#003745]">{opt.title}</h3>
                      <div className="text-[#568996] font-medium text-sm mb-2">{opt.subtitle}</div>
                      <p className="text-sm text-[#568996]">{opt.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'action' && (
              <motion.div 
                key="action"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white rounded-[4px] border border-[#003745]/20 divide-y divide-[#E6EEF0]">
                  <div className="p-6 flex items-center gap-4">
                    <div className="bg-[#F5EFE4] p-3 rounded-[4px] text-[#003745]">
                      <Globe size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[#003745]">{currentGoal.strategies[selectedStrategy].product}</h3>
                        <span className="bg-[#003745] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Empfohlen</span>
                      </div>
                      <p className="text-sm text-[#568996]">ISIN: DE000DK0ECU8 • Ausschüttend</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#003745]">{formatCurrency(monthlySavings)}</div>
                      <div className="text-xs text-[#568996]">monatlich</div>
                    </div>
                  </div>
                  {/* Optional additions */}
                  <div className="p-6 flex items-center gap-4 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="bg-[#F4F9FA] p-3 rounded-[4px] text-[#9FB6BC]">
                      <Lock size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-[#003745]">Vermögenswirksame Leistungen (VL)</h3>
                      <p className="text-sm text-[#568996]">Arbeitgeberzuschuss nutzen</p>
                    </div>
                    <div className="w-6 h-6 border-2 border-[#003745]/20 rounded-[4px] flex items-center justify-center"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* CTA SECTION - Static */}
      <div className="bg-white border-t border-[#003745]/10 p-4 md:p-8 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
          
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
             <Button 
                onClick={handleScrollToTop}
                size="lg" 
                className="w-full md:w-auto text-lg px-12 py-6 shadow-none flex items-center gap-2"
              >
                Plan anpassen <ArrowUp size={18} />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full md:w-auto text-lg px-12 py-6 shadow-none border-[#003745] text-[#003745] hover:bg-[#F4F9FA]"
              >
                Persönliche Beratung starten
              </Button>
          </div>

          <div className="w-full max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9FB6BC]" size={20} strokeWidth={1.5} />
            <input 
              type="text" 
              placeholder="Sparkasse finden (PLZ oder Ort)" 
              className="w-full bg-[#F4F9FA] border border-[#003745]/20 rounded-[4px] py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#003745] focus:border-[#003745] outline-none text-[#003745] placeholder-[#9FB6BC]"
            />
          </div>

          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#003745]/20 rounded-[4px] text-[#003745] hover:bg-[#F4F9FA] hover:border-[#003745] transition-colors text-sm font-medium">
              <Save size={16} strokeWidth={1.5} />
              <span>Speichern</span>
            </button>
            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 bg-white border rounded-[4px] transition-colors text-sm font-medium",
                isExporting
                  ? "border-[#9FB6BC] text-[#9FB6BC] cursor-not-allowed"
                  : "border-[#003745]/20 text-[#003745] hover:bg-[#F4F9FA] hover:border-[#003745]"
              )}
            >
              <Download size={16} strokeWidth={1.5} />
              <span>{isExporting ? 'Erzeuge PDF...' : 'PDF'}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#003745]/20 rounded-[4px] text-[#003745] hover:bg-[#F4F9FA] hover:border-[#003745] transition-colors text-sm font-medium">
              <Mail size={16} strokeWidth={1.5} />
              <span>E-Mail</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#003745]/20 rounded-[4px] text-[#003745] hover:bg-[#F4F9FA] hover:border-[#003745] transition-colors text-sm font-medium">
              <Share2 size={16} strokeWidth={1.5} />
              <span>Teilen</span>
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed left-[-10000px] top-0 z-[-1]">
        <div
          ref={pdfContainerRef}
          className="bg-white"
          style={{
            width: '794px',
            minHeight: '1123px',
            padding: '64px',
            color: '#003745',
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
          }}
        >
          <div style={{ borderBottom: '2px solid #003745', paddingBottom: '24px', marginBottom: '28px' }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#568996', fontWeight: 700 }}>
              Sparc Light · Ergebnisbericht
            </div>
            <h1 style={{ fontSize: '38px', lineHeight: 1.15, fontWeight: 700, margin: '10px 0 0 0', letterSpacing: '-0.02em' }}>
              Ihr Sparplan auf einen Blick
            </h1>
            <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '14px', color: '#568996', lineHeight: 1.45 }}>
              Ziel: <span style={{ color: '#003745', fontWeight: 600 }}>{pdfData.goalLabel}</span> · Datum: {pdfData.dateLabel}
            </p>
          </div>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', marginTop: 0, letterSpacing: '-0.01em' }}>Nutzerangaben</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                border: '1px solid #D8E5E8',
                borderRadius: '4px',
                padding: '16px',
                background: '#F4F9FA',
              }}
            >
              <PdfKeyValue label="Sparziel" value={pdfData.goalLabel} />
              <PdfKeyValue label="Laufzeit" value={`${pdfData.durationYears} Jahre (bis ${pdfData.targetYear})`} />
              <PdfKeyValue label="Strategie" value={pdfData.strategyLabel} />
              <PdfKeyValue label="Renditeannahme" value={pdfData.strategyRateLabel} />
            </div>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', marginTop: 0, letterSpacing: '-0.01em' }}>Zusammenfassung der Ergebnisse</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                border: '1px solid #D8E5E8',
                borderRadius: '4px',
                padding: '16px',
                background: '#FFFFFF',
              }}
            >
              <PdfKeyValue label="Laufzeit" value={`${pdfData.durationYears} Jahre`} />
              <PdfKeyValue label="Zielbetrag" value={formatCurrency(pdfData.targetAmount)} />
              <PdfKeyValue label="Monatliche Sparrate" value={formatCurrency(pdfData.monthlySavings)} />
              <PdfKeyValue label="Voraussichtlicher Endwert" value={formatCurrency(pdfData.projectedValue)} />
            </div>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', marginTop: 0, letterSpacing: '-0.01em' }}>Ergebnis-Interpretation</h2>
            <p style={{ marginTop: 0, marginBottom: '12px', color: '#2C4E57', fontSize: '14px', lineHeight: 1.55 }}>
              Mit der gewählten Sparrate von <strong>{formatCurrency(pdfData.monthlySavings)}</strong> erreichen Sie Ihr Ziel voraussichtlich bis zum Jahr <strong>{pdfData.targetYear}</strong>.
            </p>
            <p style={{ marginTop: 0, marginBottom: '14px', color: '#2C4E57', fontSize: '14px', lineHeight: 1.55 }}>
              Die erwarteten Erträge betragen <strong>+{formatCurrency(pdfData.totalReturn)}</strong>. Das entspricht einem geschätzten Gesamtwert von <strong>{formatCurrency(pdfData.projectedValue)}</strong>.
            </p>
            <div style={{ border: '1px solid #D8E5E8', borderRadius: '4px', padding: '16px', display: 'grid', gap: '10px', background: '#FFFFFF' }}>
              <PdfKeyValue label="Investiertes Kapital" value={formatCurrency(pdfData.totalInvested)} />
              <PdfKeyValue label="Davon Erträge" value={`+${formatCurrency(pdfData.totalReturn)}`} />
              <PdfKeyValue label="Voraussichtlicher Endwert" value={formatCurrency(pdfData.projectedValue)} />
            </div>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', marginTop: 0, letterSpacing: '-0.01em' }}>Vergleich mit 0 % Rendite</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                border: '1px solid #D8E5E8',
                borderRadius: '4px',
                padding: '16px',
                background: '#FFFFFF',
              }}
            >
              <div style={{ border: '1px solid #D8E5E8', borderRadius: '4px', padding: '12px', background: '#F4F9FA' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '8px', color: '#003745', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Mit FondsSparplan
                </div>
                <PdfKeyValue label="Monatlich" value={formatCurrency(pdfData.monthlySavings)} />
                <PdfKeyValue label="Endwert" value={formatCurrency(pdfData.projectedValue)} />
              </div>
              <div style={{ border: '1px solid #D8E5E8', borderRadius: '4px', padding: '12px', background: '#F5EFE4' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '8px', color: '#003745', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Ohne Rendite (0 %)
                </div>
                <PdfKeyValue label="Monatlich" value={formatCurrency(pdfData.zeroReturnMonthly)} />
                <PdfKeyValue label="Mehrbedarf" value={`${pdfData.monthlyDifference > 0 ? '+' : ''}${formatCurrency(pdfData.monthlyDifference)}`} />
              </div>
            </div>
            <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '13px', color: '#2C4E57', lineHeight: 1.5 }}>
              Interpretation: {pdfData.monthlyDifference > 0
                ? `Ohne Rendite wäre monatlich ${formatCurrency(pdfData.monthlyDifference)} mehr Sparleistung nötig, um das gleiche Ziel im gleichen Zeitraum zu erreichen.`
                : 'Die monatliche Sparleistung ist bereits auf dem Niveau eines 0 %-Szenarios oder darunter.'}
            </p>
          </section>

          <footer style={{ borderTop: '1px solid #D8E5E8', paddingTop: '12px', fontSize: '11px', color: '#568996', lineHeight: 1.5 }}>
            Orientierungsrechnung, keine Garantie der Wertentwicklung. Alle Angaben dienen der Veranschaulichung auf Basis Ihrer Eingaben. Seite 1/1
          </footer>
        </div>
      </div>
    </div>
  );
};

// Subcomponent for Result Cards
const ResultCard = ({ label, value, highlight = false }: { label: string, value: string | number, highlight?: boolean }) => (
  <div className={clsx(
    "rounded-[4px] p-6 flex flex-col items-center justify-center text-center border transition-all h-full relative",
    highlight 
      ? "bg-[#003745] border-[#003745] shadow-md" 
      : "bg-white border-[#003745]/20"
  )}>
    <span className={clsx("text-xs font-bold uppercase tracking-wider mb-2", highlight ? "text-[#9FB6BC]" : "text-[#568996]")}>
      {label}
    </span>
    <span className={clsx("text-4xl font-bold tracking-tight mb-2", highlight ? "text-white" : "text-[#003745]")}>
      {value}
    </span>
    {highlight && (
      <span className="text-[10px] font-medium uppercase tracking-wide text-[#9FB6BC] bg-white/10 px-2 py-0.5 rounded-[4px]">
        Errechnet
      </span>
    )}
  </div>
);

// Editable Card Subcomponent
const EditableCard = ({ 
  label, value, suffix, onSave, min, max, step 
}: { 
  label: string, 
  value: number, 
  suffix: string, 
  onSave: (val: number) => void,
  min?: number,
  max?: number,
  step?: number
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-[4px] p-6 border border-[#003745]/20 flex flex-col items-center justify-center text-center relative group hover:border-[#003745] transition-colors cursor-pointer h-full">
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Edit2 size={16} className="text-[#9FB6BC]" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-[#568996] mb-2">{label}</span>
      
      {isEditing ? (
        <div className="flex flex-col items-center gap-2 w-full">
          <input 
            type="number" 
            value={tempValue} 
            onChange={(e) => setTempValue(Number(e.target.value))}
            className="w-full text-center border-b-2 border-[#003745] text-2xl font-bold outline-none pb-1 text-[#003745]"
            autoFocus
          />
          <button 
            onClick={handleSave}
            className="text-xs bg-[#003745] text-white px-3 py-1 rounded-none"
          >
            OK
          </button>
        </div>
      ) : (
        <div 
          onClick={() => setIsEditing(true)}
          className="flex items-baseline gap-1"
        >
          <span className="text-3xl font-bold text-[#003745]">{value.toLocaleString()}</span>
          <span className="text-lg font-medium text-[#9FB6BC]">{suffix}</span>
        </div>
      )}
    </div>
  );
};

// Comparison Section Component
const ComparisonSection = ({ 
  targetAmount, durationYears, monthlySavings, currentYear, totalInvested, totalReturn, zeroReturnMonthly, monthlyDifference
}: { 
  targetAmount: number, 
  durationYears: number, 
  monthlySavings: number, 
  currentYear: number,
  totalInvested: number,
  totalReturn: number,
  zeroReturnMonthly: number,
  monthlyDifference: number
}) => {
  // Calculations for 0% return comparison (Fixed Goal Scenario)
  // How much would I need to save monthly to reach the SAME target in the SAME time with 0% return?
  const months = durationYears * 12;
  const zeroReturnInvested = zeroReturnMonthly * months; // This is basically the target amount

  const MetricRow = ({ label, value, highlight = false, isZero = false }: { label: string, value: string | number, highlight?: boolean, isZero?: boolean }) => (
    <div className="flex justify-between items-center py-2.5">
      <span className="text-sm text-[#568996]">{label}</span>
      <span className={clsx(
        "font-medium",
        highlight ? "text-[#277A6B] font-bold" : "text-[#003745]",
        isZero && "text-[#9FB6BC]"
      )}>
        {value}
      </span>
    </div>
  );

  return (
    <section>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        
        {/* Left Card: Mit FondsSparplan */}
        <div className="bg-white rounded-[4px] border border-[#003745]/10 p-6 flex flex-col h-full">
          {/* Header */}
          <div className="pb-4 flex justify-between items-start">
            <h3 className="font-bold text-[#003745] text-lg">Mit FondsSparplan</h3>
            {/* Badge optional/removed for cleaner look or kept as small indicator */}
          </div>

          <div className="space-y-4 flex-grow mb-6">
            {/* Primary Metric */}
            <div>
              <div className="text-xs text-[#568996] uppercase tracking-wide mb-1">Monatliche Sparrate</div>
              <div className="text-4xl font-bold text-[#003745] tracking-tight">{formatCurrency(monthlySavings)}</div>
            </div>

            {/* Secondary Metrics Grid */}
            <div className="pt-2">
               <MetricRow label="Laufzeit" value={`${durationYears} Jahre`} />
               <MetricRow label="Ziel erreicht" value={currentYear + durationYears} />
               <MetricRow label="Investiertes Kapital" value={formatCurrency(totalInvested)} />
               <MetricRow label="Voraussichtlicher Endwert" value={formatCurrency(targetAmount)} />
               <MetricRow label="Davon Erträge" value={`+${formatCurrency(totalReturn)}`} highlight />
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="bg-[#277A6B]/10 rounded-[4px] p-3 text-center">
            <span className="text-[#277A6B] font-medium text-sm">
              Ziel erreicht wie geplant
            </span>
          </div>
        </div>

        {/* Right Card: Ohne Rendite */}
        <div className="bg-[#F5EFE4] rounded-[4px] border border-[#003745]/10 p-6 flex flex-col h-full">
          {/* Header */}
          <div className="pb-4 flex justify-between items-start">
             <h3 className="font-bold text-[#003745] text-lg">Ohne Rendite (Girokonto)</h3>
          </div>

          <div className="space-y-4 flex-grow mb-6">
             {/* Primary Metric */}
             <div>
               <div className="text-xs text-[#568996] uppercase tracking-wide mb-1">Benötigte Sparrate</div>
               <div className="text-4xl font-bold text-[#003745] tracking-tight">{formatCurrency(zeroReturnMonthly)}</div>
             </div>

             {/* Secondary Metrics Grid */}
             <div className="pt-2">
                <MetricRow label="Laufzeit" value={`${durationYears} Jahre`} />
                <MetricRow label="Ziel erreicht" value={currentYear + durationYears} />
                <MetricRow label="Investiertes Kapital" value={formatCurrency(zeroReturnInvested)} />
                <MetricRow label="Voraussichtlicher Endwert" value={formatCurrency(targetAmount)} />
                <MetricRow label="Davon Erträge" value="0 EUR" />
             </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="bg-white rounded-[4px] p-3 text-center">
            <span className="text-[#003745] font-medium text-sm">
              Ohne Rendite müssen Sie <span className="text-[#277A6B] font-bold">{monthlyDifference > 0 ? '+' : ''}{formatCurrency(monthlyDifference)}</span> pro Monat sparen.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

const PdfKeyValue = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'baseline' }}>
    <span style={{ fontSize: '12px', color: '#568996', letterSpacing: '0.01em' }}>{label}</span>
    <span style={{ fontSize: '13px', fontWeight: 700, textAlign: 'right', color: '#003745' }}>{value}</span>
  </div>
);
