import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppHeader } from './AppHeader';
import { ConnectScreen } from '../connect/ConnectScreen';
import { SelectStep } from '../select/SelectStep';
import { PrepareStep } from '../prepare/PrepareStep';
import { GradeStep } from '../grade/GradeStep';
import { ReviewStep } from '../review/ReviewStep';
import { ExportStep } from '../export/ExportStep';
import { useGrading } from '../../contexts/GradingContext';
import { StepId } from '../../types/grading';

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 16 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -16 })
};

function StepContent({ step }: {step: StepId;}) {
  switch (step) {
    case 'select':
      return <SelectStep />;
    case 'prepare':
      return <PrepareStep />;
    case 'grade':
      return <GradeStep />;
    case 'review':
      return <ReviewStep />;
    case 'export':
      return <ExportStep />;
    default:
      return null;
  }
}

export function AppShell() {
  const { state, assignment } = useGrading();
  // Guard: steps beyond selection need an assignment.
  const step: StepId = assignment ? state.step : 'select';

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step, state.assignmentId]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!state.connected ?
      <motion.div key="connect" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <ConnectScreen />
        </motion.div> :

      <motion.div
        key="app"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="flex min-h-screen w-full flex-col bg-background">
        
          <AppHeader />
          <main className="flex-1 px-4 sm:px-6">
            <div className="mx-auto w-full max-w-7xl pt-6">
              <AnimatePresence mode="wait" initial={false} custom={state.direction}>
                <motion.div
                key={`${step}-${step === 'select' ? '' : state.assignmentId ?? ''}`}
                custom={state.direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}>
                
                  <StepContent step={step} />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </motion.div>
      }
    </AnimatePresence>);

}