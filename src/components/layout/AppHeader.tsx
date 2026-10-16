import React, { useState } from 'react';
import { ChevronRight, GraduationCap, History, LogOut, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { Button } from '../ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
'../ui/DropdownMenu';
import { HistorySheet } from './HistorySheet';
import { WorkflowStepper } from './WorkflowStepper';
import { useGrading } from '../../contexts/GradingContext';
import { teacher } from '../../data/courses';
import { initials } from '../../utils/grading';

export function AppHeader() {
  const { course, assignment, disconnect, goTo } = useGrading();
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => goTo('select')}
          className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          aria-label="Gradewise — choose an assignment">
          
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="size-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Gradewise</span>
        </button>

        {course && assignment &&
        <div className="hidden min-w-0 items-center gap-1.5 text-sm text-muted-foreground md:flex">
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/50" aria-hidden="true" />
            <span className="truncate">{course.name}</span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/50" aria-hidden="true" />
            <span className="truncate font-medium text-foreground">{assignment.title}</span>
          </div>
        }

        <div className="ml-auto flex items-center gap-1.5">
          <span className="mr-2 hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Classroom connected
          </span>
          <Button variant="ghost" size="sm" onClick={() => setHistoryOpen(true)}>
            <History aria-hidden="true" />
            <span className="hidden sm:inline">History</span>
            <span className="sr-only sm:hidden">Grading history</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                aria-label="Account menu">
                
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary text-[11px] text-primary-foreground">{initials(teacher.name)}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <div className="text-sm font-medium">{teacher.name}</div>
                <div className="text-xs font-normal text-muted-foreground">{teacher.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => toast.success('Courses are up to date with Google Classroom')}>
                <RefreshCw aria-hidden="true" />
                Sync with Classroom
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={disconnect}>
                <LogOut aria-hidden="true" />
                Disconnect Classroom
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <WorkflowStepper />
      <HistorySheet open={historyOpen} onOpenChange={setHistoryOpen} />
    </header>);

}