import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import clsx from 'clsx';
import { GOALS, GoalId, getGoal, GoalData } from './goalsData';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GoalCarousel3DProps {
  selectedGoalId: GoalId;
  onSelect: (id: GoalId) => void;
  goals: GoalData[];
}

export const GoalCarousel3D: React.FC<GoalCarousel3DProps> = ({ selectedGoalId, onSelect, goals }) => {
  // Find index of selected goal to initialize/sync state
  const initialIndex = goals.findIndex(g => g.id === selectedGoalId);
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  // Sync internal state if prop changes (optional, but good for consistency)
  useEffect(() => {
    const idx = goals.findIndex(g => g.id === selectedGoalId);
    if (idx >= 0 && idx !== activeIndex) {
      setActiveIndex(idx);
    }
  }, [selectedGoalId, goals]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + goals.length) % goals.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % goals.length);
  };

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
    onSelect(goals[index].id);
  };

  // Update parent when activeIndex changes via arrows
  useEffect(() => {
    const goal = goals[activeIndex];
    if (goal && goal.id !== selectedGoalId) {
      onSelect(goal.id);
    }
  }, [activeIndex, onSelect, selectedGoalId, goals]);

  // Helper to get visual properties based on offset from center
  const getCardStyle = (offset: number) => {
    // Offset 0 is center, -1 is left, 1 is right, etc.
    const isCenter = offset === 0;
    const absOffset = Math.abs(offset);
    
    // Default hidden state
    let styles = {
      x: 0,
      scale: 0.5,
      opacity: 0,
      zIndex: 0,
      rotateY: 0,
      pointerEvents: 'none' as const,
      display: 'none'
    };

    if (absOffset > 2) return styles;

    styles.display = 'block';
    styles.pointerEvents = 'auto';

    if (offset === 0) {
      // Center
      styles.x = 0;
      styles.scale = 1.0;
      styles.opacity = 1;
      styles.zIndex = 50;
      styles.rotateY = 0;
    } else if (absOffset === 1) {
      // Adjacent
      styles.x = offset * 240; // Spacing
      styles.scale = 0.9;
      styles.opacity = 0.75;
      styles.zIndex = 40;
      styles.rotateY = offset > 0 ? -15 : 15; // Rotate towards center
    } else if (absOffset === 2) {
      // Outer
      styles.x = offset * 420; // Spacing
      styles.scale = 0.8;
      styles.opacity = 0.5;
      styles.zIndex = 30;
      styles.rotateY = offset > 0 ? -25 : 25;
    }

    return styles;
  };

  return (
    <div className="relative w-full max-w-[1200px] h-[400px] flex items-center justify-center mx-auto perspective-[1000px] overflow-hidden">
      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-10 z-[60] w-10 h-10 flex items-center justify-center bg-white border border-[#003745] hover:bg-[#F4F9FA] transition-colors focus:ring-2 focus:ring-[#0043B4] focus:outline-none rounded-none"
        aria-label="Previous goal"
      >
        <ChevronLeft className="text-[#003745]" size={24} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 md:right-10 z-[60] w-10 h-10 flex items-center justify-center bg-white border border-[#003745] hover:bg-[#F4F9FA] transition-colors focus:ring-2 focus:ring-[#0043B4] focus:outline-none rounded-none"
        aria-label="Next goal"
      >
        <ChevronRight className="text-[#003745]" size={24} />
      </button>

      {/* Carousel Track */}
      <div className="relative w-full h-full flex items-center justify-center">
        {goals.map((goal, index) => {
          // Calculate offset handling infinite loop
          let offset = (index - activeIndex);
          // Adjust offset to be shortest path
          if (offset > goals.length / 2) offset -= goals.length;
          if (offset < -goals.length / 2) offset += goals.length;

          const style = getCardStyle(offset);
          const isSelected = offset === 0;
          const isVisible = Math.abs(offset) <= 2;

          return (
            <motion.div
              key={goal.id}
              role="button"
              tabIndex={isVisible ? 0 : -1}
              aria-label={`Select goal: ${goal.label}`}
              aria-selected={isSelected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(index);
                }
              }}
              initial={false}
              animate={{
                x: style.x,
                scale: style.scale,
                opacity: style.opacity,
                zIndex: style.zIndex,
                rotateY: style.rotateY,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              style={{
                position: 'absolute',
                width: '14rem', // w-56
                height: '18rem', // h-72
              }}
              className={clsx(
                "cursor-pointer rounded-[4px] bg-white shadow-xl overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0043B4] focus-visible:ring-offset-2 border border-[#003745]/20",
                // Only show shadow on visible cards
                isVisible ? "visible" : "invisible"
              )}
              onClick={() => handleCardClick(index)}
            >
              {/* Card Content - largely reused from previous implementation */}
              <div className="absolute inset-0 bg-[#F4F9FA]">
                <ImageWithFallback 
                  src={goal.image} 
                  alt={goal.label} 
                  className="w-full h-full object-cover"
                />
                <div className={clsx(
                  "absolute inset-0 transition-colors duration-300",
                  isSelected ? "bg-primary/10" : "bg-black/10"
                )} />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#003745]/95 via-[#003745]/80 to-transparent pt-20 flex flex-col items-center">
                <div className={clsx(
                  "p-3 rounded-full mb-3 backdrop-blur-md transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-white/20 text-white"
                )}>
                  <goal.icon size={28} strokeWidth={1.5} />
                </div>
                <span className="text-white font-medium text-lg leading-tight text-center">{goal.label}</span>
                
                {/* Selection Check Indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-2 shadow-lg border-2 border-white"
                    >
                      <Check size={20} strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
