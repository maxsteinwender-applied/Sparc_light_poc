import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GoalId } from './goalsData';

export type StrategyType = 'security' | 'balanced' | 'growth';

interface WizardState {
  step: number;
  goal: GoalId;
  customGoalName: string;
  targetAmount: number;
  durationYears: number;
  selectedStrategy: StrategyType;
  calculationFactors: string[];
}

interface WizardContextType extends WizardState {
  setStep: (step: number) => void;
  setGoal: (goal: GoalId) => void;
  setCustomGoalName: (name: string) => void;
  setTargetAmount: (amount: number) => void;
  setDurationYears: (years: number) => void;
  setSelectedStrategy: (strategy: StrategyType) => void;
  setCalculationFactors: (factors: string[]) => void;
  toggleCalculationFactor: (factor: string) => void;
  resetFlow: () => void;
}

const defaultState: WizardState = {
  step: 1,
  goal: 'travel', // Default to F (Urlaub/Reise) or A? Prompt didn't specify default. Using 'travel' as it was close to 'Weltreise'.
  customGoalName: '',
  targetAmount: 20000,
  durationYears: 8,
  selectedStrategy: 'growth',
  calculationFactors: [],
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState<number>(1);
  const [goal, setGoal] = useState<GoalId>('travel');
  const [customGoalName, setCustomGoalName] = useState<string>('');
  const [targetAmount, setTargetAmount] = useState<number>(6000);
  const [durationYears, setDurationYears] = useState<number>(2);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('balanced');
  // Store selections per goal ID
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const calculationFactors = selections[goal] || [];

  const toggleCalculationFactor = (factor: string) => {
    setSelections(prev => {
      const currentFactors = prev[goal] || [];
      const newFactors = currentFactors.includes(factor)
        ? currentFactors.filter(f => f !== factor)
        : [...currentFactors, factor];
      
      return {
        ...prev,
        [goal]: newFactors
      };
    });
  };

  const setCalculationFactors = (factors: string[]) => {
    setSelections(prev => ({
      ...prev,
      [goal]: factors
    }));
  };

  const resetFlow = () => {
    setStep(1);
    setGoal('travel');
    setCustomGoalName('');
    setTargetAmount(6000);
    setDurationYears(2);
    setSelectedStrategy('balanced');
    setSelections({});
  };

  return (
    <WizardContext.Provider value={{
      step, setStep,
      goal, setGoal,
      customGoalName, setCustomGoalName,
      targetAmount, setTargetAmount,
      durationYears, setDurationYears,
      selectedStrategy, setSelectedStrategy,
      calculationFactors, setCalculationFactors,
      toggleCalculationFactor,
      resetFlow
    }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
