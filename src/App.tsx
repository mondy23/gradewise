import React from 'react';
import { MotionConfig } from 'framer-motion';
import { AppShell } from './components/layout/AppShell';
import { Toaster } from './components/ui/Sonner';
import { TooltipProvider } from './components/ui/Tooltip';
import { GradingProvider } from './contexts/GradingContext';

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={200}>
        <GradingProvider>
          <AppShell />
        </GradingProvider>
        <Toaster position="bottom-right" />
      </TooltipProvider>
    </MotionConfig>);

}