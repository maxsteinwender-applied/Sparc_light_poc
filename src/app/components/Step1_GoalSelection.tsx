import React, { useMemo, useCallback } from 'react';
import { useWizard } from './WizardContext';
import { motion, AnimatePresence } from 'motion/react';
import { PenLine } from 'lucide-react';
import { GoalCarousel3D } from './GoalCarousel3D';
import { GOALS, getGoal } from './goalsData';
import { Button } from './ui/button';
import { WizardInput } from './ui/WizardInput';

// Define standard goals outside component to ensure reference stability
const standardGoals = GOALS.filter(g => g.id !== 'custom');

export const Step1_GoalSelection = () => {
  const { 
    goal, setGoal, setStep, 
    customGoalName, setCustomGoalName, 
    setTargetAmount, setDurationYears, 
    setCalculationFactors, setSelectedStrategy 
  } = useWizard();

  const isCustomMode = goal === 'custom';

  const handleGoalSelect = useCallback((id: any) => {
    setGoal(id);
    const newGoalData = getGoal(id);
    
    // Reset defaults based on new goal
    setTargetAmount(newGoalData.baseTargetAmount);
    setDurationYears(newGoalData.defaultTimeHorizonYears);
    setSelectedStrategy(newGoalData.defaultStrategy);
    setCalculationFactors([]); // Reset chips

    if (id !== 'custom') {
      setCustomGoalName('');
    }
  }, [setGoal, setTargetAmount, setDurationYears, setSelectedStrategy, setCalculationFactors, setCustomGoalName]);

  const handleContinue = () => {
    if (goal === 'custom' && !customGoalName.trim()) return;
    setStep(2);
  };

  // Label for the button in standard mode
  const selectedGoalLabel = useMemo(() => GOALS.find(g => g.id === goal)?.label, [goal]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center w-full max-w-7xl mx-auto px-4 py-8 md:py-12 overflow-hidden relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:mb-12 relative z-10"
      >
        <span className="text-[#EE0000] font-medium text-sm tracking-widest uppercase mb-3 block">
          Schritt 1 von 5
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-[#003745] mb-4 tracking-tight">
          Wofür möchten Sie sparen?
        </h1>
        <p className="text-lg md:text-xl text-[#568996] font-light">
          Ihr Ziel bestimmt alle weiteren Schritte.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!isCustomMode ? (
          <motion.div
            key="carousel-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center"
          >
            {/* 3D Carousel Section */}
            <div className="w-full relative z-0 mb-8">
              <GoalCarousel3D 
                selectedGoalId={goal} 
                onSelect={handleGoalSelect} 
                goals={standardGoals}
              />
            </div>

            <div className="flex flex-col items-center gap-4 w-full max-w-md relative z-10">
              <span className="text-[#568996] text-sm mb-4 block">
                Als Nächstes bestimmen wir den Betrag.
              </span>
              <Button
                onClick={handleContinue}
                size="lg"
                className="text-lg px-12 py-6 h-auto w-full md:w-auto bg-[#EE0000] hover:bg-[#D00000] text-white rounded-none transition-colors shadow-lg"
              >
                Mit {selectedGoalLabel} fortfahren
              </Button>

              {/* Custom Goal Link */}
              <button 
                onClick={() => handleGoalSelect('custom')}
                className="flex items-center gap-2 text-[#003745] hover:underline font-medium mt-2 group"
              >
                <PenLine size={18} />
                <span>Individuelles Sparziel erstellen</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="custom-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-8 w-full max-w-md relative z-10"
          >
            <div className="w-full bg-white p-8 rounded-lg shadow-sm border border-[#003745]/10">
              <div className="text-left w-full space-y-4">
                <label className="text-lg font-semibold text-[#003745] block">
                  Name Ihres Sparziels
                </label>
                <WizardInput
                  autoFocus
                  value={customGoalName}
                  onChange={(e) => setCustomGoalName(e.target.value)}
                  placeholder="z. B. Auszeit, Hochzeit, Sicherheitspuffer..."
                  className="w-full text-lg p-4"
                />
                <p className="text-sm text-[#568996]">
                  Definieren Sie Ihr eigenes Ziel – wir helfen bei Betrag, Zeitraum und Plan.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full items-center">
              <span className="text-[#568996] text-sm mb-4 block">
                Als Nächstes bestimmen wir den Betrag.
              </span>
              <Button
                onClick={handleContinue}
                size="lg"
                disabled={!customGoalName.trim()}
                className="text-lg px-12 py-6 h-auto w-full bg-[#EE0000] hover:bg-[#D00000] text-white rounded-none transition-colors shadow-lg"
              >
                Mit individuellem Ziel fortfahren
              </Button>
              
              {/* Optional Back Button - helpful for UX although not explicitly requested, allows returning to carousel */}
              <button 
                onClick={() => handleGoalSelect(standardGoals[0].id)}
                className="text-[#568996] hover:text-[#003745] text-sm hover:underline"
              >
                Zurück zur Auswahl
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
