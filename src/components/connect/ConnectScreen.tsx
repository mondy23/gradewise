import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CheckCircle2, FileText, GraduationCap, Loader2, ShieldCheck, UserCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { GoogleMark } from './GoogleMark';
import { useGrading } from '../../contexts/GradingContext';
import { teacher } from '../../data/courses';

type ConnectPhase = 'idle' | 'authorizing' | 'connected';

const PERMISSIONS = [
{ icon: BookOpen, title: 'View your courses and rosters', text: 'So you can choose a class to grade.' },
{ icon: FileText, title: 'Read assignments and student work', text: 'Instructions, attachments, and submissions.' },
{ icon: UserCheck, title: 'You stay in control of grades', text: 'Nothing is posted to Classroom without your approval.' }];


export function ConnectScreen() {
  const { connect } = useGrading();
  const [phase, setPhase] = useState<ConnectPhase>('idle');

  const handleConnect = () => {
    setPhase('authorizing');
    window.setTimeout(() => {
      setPhase('connected');
      window.setTimeout(connect, 700);
    }, 1300);
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Gradewise</span>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="space-y-2 text-center">
              <h1 className="text-xl font-semibold tracking-tight">Connect Google Classroom</h1>
              <p className="text-sm text-muted-foreground">
                Grade student work with AI suggestions you review and approve — in one continuous flow.
              </p>
            </div>

            <ul className="space-y-3">
              {PERMISSIONS.map(({ icon: Icon, title, text }) =>
              <li key={title} className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                    <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="text-sm font-medium">{title}</div>
                    <div className="text-sm text-muted-foreground">{text}</div>
                  </div>
                </li>
              )}
            </ul>

            <div aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                {phase === 'connected' ?
                <motion.div
                  key="connected"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-9 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 text-sm font-medium text-emerald-700">
                  
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    Connected as {teacher.email}
                  </motion.div> :

                <motion.div key="button" exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Button
                    size="lg"
                    variant="outline"
                    className="w-full gap-2 active:scale-[0.99]"
                    onClick={handleConnect}
                    disabled={phase === 'authorizing'}>
                    
                      {phase === 'authorizing' ?
                    <>
                          <Loader2 className="animate-spin" aria-hidden="true" />
                          Waiting for Google…
                        </> :

                    <>
                          <GoogleMark className="size-4" />
                          Continue with Google
                        </>
                    }
                    </Button>
                  </motion.div>
                }
              </AnimatePresence>
            </div>

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Read-only access. You can disconnect anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>);

}