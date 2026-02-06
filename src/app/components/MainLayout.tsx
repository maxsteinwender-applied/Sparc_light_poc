import React from 'react';
import { useWizard, WizardProvider } from './WizardContext';
import { Step1_GoalSelection } from './Step1_GoalSelection';
import { Step2_TargetAmountType } from './Step2_TargetAmountType';
import { Step3_CalculateAmount } from './Step3_CalculateAmount';
import { Step4_Duration } from './Step4_Duration';
import { Step5_Results } from './Step5_Results';
import { AnimatePresence, motion } from 'motion/react';
import dekaLogoImage from 'figma:asset/e088cf5e6488ed30341523cb4f504779a4587bd6.png';

const MainLayoutContent = () => {
  const { step, resetFlow } = useWizard();

  return (
    <div className="min-h-screen bg-white text-[#003745] font-sans selection:bg-[#EE0000] selection:text-white">
      {/* Header */}
      <header className="bg-white border-b border-[#E6EEF0] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetFlow}>
            <img src={dekaLogoImage} alt="DekaBank Logo" className="h-8 w-auto" />
            <span className="font-bold text-lg tracking-tight text-[#003745]">Sparc Light</span>
          </div>
          
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
               <div 
                 key={s} 
                 className={`h-1.5 rounded-full transition-all duration-300 ${
                   step >= s ? 'w-8 bg-[#003745]' : 'w-2 bg-[#003745]/25'
                 }`} 
               />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {step === 1 && <Step1_GoalSelection />}
            {step === 2 && <Step2_TargetAmountType />}
            {step === 3 && <Step3_CalculateAmount />}
            {step === 4 && <Step4_Duration />}
            {step === 5 && <Step5_Results />}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Footer (Simple) */}
      {step < 5 && (
        <footer className="py-8 text-center text-[#9FB6BC] text-sm">
          © 2026 DekaBank Deutsche Girozentrale
        </footer>
      )}
    </div>
  );
};

export const MainLayout = () => {
  return (
    <WizardProvider>
      <MainLayoutContent />
    </WizardProvider>
  );
};
