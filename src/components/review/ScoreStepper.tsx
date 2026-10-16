import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ScoreStepperProps {
  value: number;
  max: number;
  label: string;
  onChange: (value: number) => void;
}

export function ScoreStepper({ value, max, label, onChange }: ScoreStepperProps) {
  const set = (v: number) => onChange(Math.min(max, Math.max(0, Math.round(v * 2) / 2)));
  return (
    <div className="flex items-center gap-1" role="group" aria-label={label}>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => set(value - 0.5)}
        disabled={value <= 0}
        aria-label={`Decrease ${label}`}>
        
        <Minus aria-hidden="true" />
      </Button>
      <div className="relative">
        <Input
          type="number"
          inputMode="decimal"
          min={0}
          max={max}
          step={0.5}
          value={value}
          onChange={(e) => set(Number(e.target.value))}
          aria-label={label}
          className="h-7 w-16 pr-7 text-right tabular-nums" />
        
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          /{max}
        </span>
      </div>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => set(value + 0.5)}
        disabled={value >= max}
        aria-label={`Increase ${label}`}>
        
        <Plus aria-hidden="true" />
      </Button>
    </div>);

}