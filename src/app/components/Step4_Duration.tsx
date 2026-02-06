import React from 'react';
import { useWizard } from './WizardContext';
import { motion } from 'motion/react';
import { Minus, Plus, ArrowRight, Clock, Info, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import { Button } from './ui/button';
import { getGoal } from './goalsData';

export const Step4_Duration = () => {
  const { setStep, durationYears, setDurationYears, goal, customGoalName, calculationFactors } = useWizard();
  const currentYear = new Date().getFullYear();
  const targetYear = currentYear + durationYears;

  const currentGoal = getGoal(goal);
  const goalLabel = goal === 'custom' ? customGoalName : currentGoal.label;
  const quickOptions = currentGoal.typicalTimeHorizonOptions;

  const handleBack = () => {
    // If user has selected calculation factors, they likely came from Step 3
    if (calculationFactors.length > 0) {
      setStep(3);
    } else {
      setStep(2);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-3xl mx-auto px-4 pt-20 pb-12 relative">
      <button 
        onClick={handleBack}
        className="absolute left-4 top-8 md:left-0 md:top-8 text-[#568996] hover:text-[#003745] flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ChevronLeft size={16} /> Zurück
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="text-center mb-12">
          <span className="text-[#EE0000] font-medium text-sm tracking-widest uppercase mb-3 block">
            Schritt 4 von 5
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#003745] mb-4">
            Wann möchten Sie {goalLabel} erreichen?
          </h2>
        </div>

        {/* Quick Options */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {quickOptions.map(years => (
            <button
              key={years}
              onClick={() => setDurationYears(years)}
              className={clsx(
                "py-4 rounded-none text-lg font-medium transition-all",
                durationYears === years
                  ? "border-2 border-[#003745] bg-[#003745]/10 text-[#003745]"
                  : "border border-[#003745]/20 bg-white text-[#568996] hover:border-[#003745]"
              )}
            >
              in {years} Jahren
            </button>
          ))}
        </div>

        {/* Manual Stepper */}
        <div className="bg-white rounded-[4px] p-8 border border-[#003745]/20 shadow-none mb-8 flex flex-col items-center">
          <div className="flex items-center justify-between w-full max-w-sm mb-4">
            <button 
              onClick={() => setDurationYears(Math.max(1, durationYears - 1))}
              disabled={durationYears <= 1}
              aria-label="Wert verringern"
              className={clsx(
                "w-12 h-12 rounded-none flex items-center justify-center transition-colors shadow-none border-none outline-none focus-visible:ring-2 focus-visible:ring-[#0043B4] focus-visible:outline-none",
                durationYears <= 1 
                  ? "bg-[#D5DEE1] text-[#003745]/60 cursor-not-allowed" 
                  : "bg-[#003745] text-white hover:bg-[#002C36] active:bg-[#00222A]"
              )}
            >
              <Minus size={20} strokeWidth={1.5} />
            </button>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-[#003745] mb-1">
                {durationYears} Jahre
              </div>
              <div className="text-[#568996] font-medium">
                Zieljahr {targetYear}
              </div>
            </div>

            <button 
              onClick={() => setDurationYears(Math.min(40, durationYears + 1))}
              disabled={durationYears >= 40}
              aria-label="Wert erhöhen"
              className={clsx(
                "w-12 h-12 rounded-none flex items-center justify-center transition-colors shadow-none border-none outline-none focus-visible:ring-2 focus-visible:ring-[#0043B4] focus-visible:outline-none",
                durationYears >= 40
                  ? "bg-[#D5DEE1] text-[#003745]/60 cursor-not-allowed"
                  : "bg-[#003745] text-white hover:bg-[#002C36] active:bg-[#00222A]"
              )}
            >
              <Plus size={20} strokeWidth={1.5} color={durationYears >= 40 ? "currentColor" : "white"} />
            </button>
          </div>
        </div>

        {/* Info Box */}
        {currentGoal.whatItMeans.length > 0 && (
          <div className="bg-[#F4F9FA] text-[#003745] p-5 rounded-[4px] text-sm leading-relaxed flex gap-4 mb-8 items-start border border-[#E6EEF0]">
            <div className="bg-white p-2 rounded-[4px] shrink-0 border border-[#E6EEF0]">
              <Clock size={20} className="text-[#003745]" strokeWidth={1.5} />
            </div>
            <div className="pt-1">
              <p className="font-semibold mb-1">Gut zu wissen:</p>
              <ul className="list-disc pl-4 space-y-1">
                {currentGoal.whatItMeans.map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center">
          <span className="text-[#568996] text-sm mb-4 block">
            Fast geschafft – gleich sehen Sie Ihren Plan.
          </span>
          <Button
            onClick={() => setStep(5)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-12"
            size="lg"
          >
            Ergebnis anzeigen <ArrowRight size={18} />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
