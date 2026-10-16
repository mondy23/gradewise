import React from 'react';
import { motion } from 'framer-motion';

interface ScoreDistributionProps {
  percents: number[];
}

const BANDS = [
{ label: '90–100%', min: 90, max: 101 },
{ label: '80–89%', min: 80, max: 90 },
{ label: '70–79%', min: 70, max: 80 },
{ label: '60–69%', min: 60, max: 70 },
{ label: 'Below 60%', min: -1, max: 60 }];


export function ScoreDistribution({ percents }: ScoreDistributionProps) {
  const counts = BANDS.map((b) => percents.filter((p) => p >= b.min && p < b.max).length);
  const peak = Math.max(1, ...counts);
  return (
    <ul className="space-y-2.5" aria-label="Score distribution">
      {BANDS.map((b, i) =>
      <li key={b.label} className="grid grid-cols-[80px_minmax(0,1fr)_24px] items-center gap-3 text-xs">
          <span className="text-muted-foreground">{b.label}</span>
          <span className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.span
            className="block h-full rounded-full bg-foreground/80"
            initial={{ width: 0 }}
            animate={{ width: `${counts[i] / peak * 100}%` }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: [0.4, 0, 0.2, 1] }} />
          
          </span>
          <span className="text-right font-medium tabular-nums">{counts[i]}</span>
        </li>
      )}
    </ul>);

}