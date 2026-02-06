import React, { useEffect, useMemo } from 'react';
import { useWizard } from './WizardContext';
import { motion } from 'motion/react';
import { Check, ArrowRight, Info, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import { Button } from './ui/button';
import { getGoal } from './goalsData';
import { formatCurrency } from './ui/utils';

export const Step3_CalculateAmount = () => {
  const { 
    setStep, 
    setTargetAmount, 
    calculationFactors, 
    toggleCalculationFactor,
    goal,
    customGoalName
  } = useWizard();

  const currentGoal = getGoal(goal);
  const goalLabel = goal === 'custom' ? customGoalName : currentGoal.label;

  const currentTotal = useMemo(() => {
    const base = currentGoal.baseTargetAmount;
    const extra = currentGoal.amountFinderChips
      .filter(chip => calculationFactors.includes(chip.label))
      .reduce((sum, chip) => sum + chip.cost, 0);
    return base + extra;
  }, [calculationFactors, currentGoal]);

  const delta = currentTotal - currentGoal.baseTargetAmount;

  // Update the global target amount whenever the calculation changes
  useEffect(() => {
    setTargetAmount(currentTotal);
  }, [currentTotal, setTargetAmount]);

  const handleBack = () => {
    setStep(2);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto px-4 min-h-[60vh] items-start pt-20 relative">
      <button 
        onClick={handleBack}
        className="absolute left-4 top-8 md:left-4 md:top-8 text-[#568996] hover:text-[#003745] flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ChevronLeft size={16} /> Zurück
      </button>
      
      {/* Left Sticky Summary */}
      <div className="w-full md:w-1/3 md:sticky md:top-24 mt-8 md:mt-0">
        <motion.div 
          layout
          className="bg-white rounded-[4px] p-8 border border-[#003745]/20 shadow-sm overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-[#003745]" />
          <h3 className="text-[#568996] font-medium mb-2 text-xs uppercase tracking-wider font-bold">Zielbetrag</h3>
          
          <motion.div 
            key={currentTotal}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={clsx(
              "text-5xl font-bold text-[#003745] tracking-tight",
              delta !== 0 ? "mb-2" : "mb-6"
            )}
          >
            {formatCurrency(currentTotal)}
          </motion.div>

          {delta !== 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={clsx(
                "font-medium text-lg mb-6",
                delta > 0 ? "text-[#277A6B]" : "text-[#AD1111]"
              )}
              aria-label={`Zielbetrag ${delta > 0 ? 'erhöht' : 'reduziert'} um ${Math.abs(delta).toLocaleString('de-DE')} Euro`}
            >
              {delta > 0 ? '+' : '−'}{Math.abs(delta).toLocaleString('de-DE')} EUR durch Ihre Auswahl
            </motion.div>
          )}

          <div className="flex gap-3 text-sm text-[#003745] bg-[#F4F9FA] p-4 rounded-[4px] mb-8 border border-[#E6EEF0]">
            <Info className="shrink-0 text-[#003745]" size={20} />
            <p className="leading-relaxed">
              Dieser Wert dient als erste Orientierung für {goalLabel}.
            </p>
          </div>

          <span className="text-[#568996] text-sm mb-4 block text-center">
            Im nächsten Schritt legen Sie die Laufzeit fest.
          </span>
          <Button
            onClick={() => setStep(4)}
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            Weiter zur Laufzeit <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>

      {/* Right Selection Area */}
      <div className="w-full md:w-2/3 mt-8 md:mt-0">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-[#EE0000] font-medium text-sm tracking-widest uppercase mb-3 block px-2">
            Schritt 3 von 5
          </span>
          <h2 className="text-3xl font-bold text-[#003745] mb-8 px-2">
            Was ist Ihnen bei {goalLabel} wichtig?
          </h2>

          <div className="flex flex-wrap gap-3 md:gap-4">
            {currentGoal.amountFinderChips.map((chip) => {
              const isSelected = calculationFactors.includes(chip.label);
              return (
                <motion.button
                  key={chip.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleCalculationFactor(chip.label)}
                  className={clsx(
                    "relative px-[14px] py-[12px] rounded-full text-left transition-all duration-200 flex items-center gap-2 border focus-visible:ring-2 focus-visible:ring-[#003745] focus-visible:outline-none min-h-[44px] cursor-pointer",
                    isSelected 
                      ? "border-[#003745] bg-[#003745]/5 shadow-sm" 
                      : "border-[#003745]/20 bg-white hover:border-[#003745]"
                  )}
                >
                  <span className="text-xl leading-none" role="img" aria-hidden="true">{chip.emoji}</span>
                  <span className={clsx(
                    "font-medium text-base whitespace-nowrap",
                    isSelected ? "text-[#003745] font-bold" : "text-[#003745]"
                  )}>
                    {chip.label}
                  </span>

                  <span className={clsx(
                    "text-sm font-medium ml-1",
                    chip.cost === 0 
                      ? "text-[#9FB6BC]" 
                      : (chip.cost > 0 ? "text-[#277A6B]" : "text-[#AD1111]")
                  )}>
                    {chip.cost === 0 ? "± 0 EUR" : (chip.cost > 0 ? "+" : "−") + Math.abs(chip.cost).toLocaleString('de-DE') + " EUR"}
                  </span>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#003745] text-white ml-2">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
          
          <p className="text-[#568996] text-sm mt-6 leading-relaxed italic px-2">
            Ausgangspunkt ist ein typischer Durchschnittswert. Ihre Auswahl kann den Betrag erhöhen oder senken.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
