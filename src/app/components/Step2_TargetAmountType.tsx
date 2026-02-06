import React, { useState } from 'react';
import { useWizard } from './WizardContext';
import { motion } from 'motion/react';
import { Calculator, Coins, ArrowRight, CheckCircle2, Info, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { WizardInput } from './ui/WizardInput';
import { getGoal } from './goalsData';

export const Step2_TargetAmountType = () => {
  const { setStep, setTargetAmount, targetAmount, goal, customGoalName } = useWizard();
  const [inputAmount, setInputAmount] = useState<string>(targetAmount > 0 ? targetAmount.toString() : '');
  
  const currentGoal = getGoal(goal);
  const goalLabel = goal === 'custom' ? customGoalName : currentGoal.label;

  const handleManualSubmit = () => {
    const val = parseInt(inputAmount.replace(/\D/g, ''), 10);
    if (!isNaN(val) && val > 0) {
      setTargetAmount(val);
      setStep(4); // Skip calculation step
    }
  };

  const handleCalculateClick = () => {
    setStep(3);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-5xl mx-auto px-4 pt-20 pb-12 relative">
      <button 
        onClick={handleBack}
        className="absolute left-4 top-8 md:left-0 md:top-8 text-[#568996] hover:text-[#003745] flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ChevronLeft size={16} /> Zurück
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center max-w-2xl"
      >
        <span className="text-[#EE0000] font-medium text-sm tracking-widest uppercase mb-3 block">
          Schritt 2 von 5
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#003745] mb-4">
          Wie viel möchten Sie für {goalLabel} ansparen?
        </h2>
        <p className="text-xl text-[#568996] font-light">
          {currentGoal.shortTeaser}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 w-full items-stretch">
        {/* Option 1: Manual Input */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-[4px] p-8 border border-[#003745]/20 shadow-none hover:shadow-lg transition-all flex flex-col hover:border-[#003745]"
        >
          <div className="bg-[#F4F9FA] w-12 h-12 rounded-[4px] flex items-center justify-center mb-6 text-[#003745]">
            <Coins size={24} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-[#003745] mb-3">Betrag eingeben</h3>
          <p className="text-[#568996] mb-8">
            Sie haben bereits eine konkrete Summe im Kopf?
          </p>
          
          <div className="mt-auto space-y-4">
            <div className="relative">
              <WizardInput
                type="text"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                placeholder="Betrag eingeben"
                className="text-lg p-4 h-14 pr-14 rounded-[4px]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9FB6BC] font-medium">EUR</span>
            </div>
            
            {currentGoal.avgTargetAmountHint && (
              <div className="bg-[#F4F9FA] text-[#003745] p-4 rounded-[4px] text-sm leading-relaxed flex gap-3 border border-[#E6EEF0]">
                <Info className="shrink-0 mt-0.5 text-[#003745]" size={16} />
                {currentGoal.avgTargetAmountHint}
              </div>
            )}

            <div>
              <span className="text-[#568996] text-sm mb-4 block text-center">
                Als Nächstes legen Sie die Laufzeit fest.
              </span>
              <Button
                onClick={handleManualSubmit}
                disabled={!inputAmount}
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
                size="lg"
              >
                Mit diesem Betrag fortfahren <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Option 2: Calculate */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-[4px] p-8 border border-[#003745]/20 shadow-none hover:shadow-lg transition-all flex flex-col relative overflow-hidden hover:border-[#003745]"
        >
          <div className="bg-[#F4F9FA] w-12 h-12 rounded-[4px] flex items-center justify-center mb-6 text-[#003745]">
            <Calculator size={24} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-[#003745] mb-3">Betrag ermitteln</h3>
          <p className="text-[#568996] mb-6">
            Wir helfen Ihnen, den passenden Betrag zu finden – basierend auf:
          </p>

          <div className="flex flex-wrap gap-2 mb-8 content-start">
            {currentGoal.amountFinderCategories.map((cat, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F9FA] text-[#003745] rounded-full text-xs font-medium border border-[#E6EEF0]">
                <CheckCircle2 size={12} /> {cat}
              </span>
            ))}
          </div>

          <div className="mt-auto">
            <span className="text-[#568996] text-sm mb-4 block text-center">
              Als Nächstes legen wir Prioritäten fest.
            </span>
            <Button
              onClick={handleCalculateClick}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              Betrag ermitteln <ArrowRight size={18} />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
