import React from 'react';

interface StepActionBarProps {
  summary?: React.ReactNode;
  children: React.ReactNode;
}

export function StepActionBar({ summary, children }: StepActionBarProps) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 text-sm text-muted-foreground" aria-live="polite">
          {summary}
        </div>
        <div className="flex items-center gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">{children}</div>
      </div>
    </div>);

}