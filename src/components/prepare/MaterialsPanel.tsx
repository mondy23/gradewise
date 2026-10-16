import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Label } from '../ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Textarea } from '../ui/Textarea';
import { SubmissionPreviewList } from './SubmissionPreviewList';
import { useGrading } from '../../contexts/GradingContext';

type MaterialTab = 'instructions' | 'key' | 'submissions';

export function MaterialsPanel() {
  const { assignment, draft, submissions, updateDraft } = useGrading();
  const [tab, setTab] = useState<MaterialTab>('instructions');
  if (!assignment || !draft) return null;

  const fade = {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.18 }
  };

  return (
    <Card className="gap-0 py-0">
      <Tabs value={tab} onValueChange={(v) => setTab(v as MaterialTab)} className="gap-0">
        <div className="overflow-x-auto border-b px-4 pt-2">
          <TabsList variant="line">
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="key">
              Answer key
              {!draft.answerKey.trim() && <span className="ml-1 size-1.5 rounded-full bg-amber-500" aria-label="empty" />}
            </TabsTrigger>
            <TabsTrigger value="submissions">
              Submissions <span className="ml-1 text-muted-foreground tabular-nums">{submissions.length}</span>
            </TabsTrigger>
          </TabsList>
        </div>
        <CardContent className="p-4 sm:p-6">
          <TabsContent value="instructions" className="mt-0">
            <motion.div {...fade}>
              <p className="whitespace-pre-line text-sm leading-relaxed">{assignment.instructions}</p>
            </motion.div>
          </TabsContent>
          <TabsContent value="key" className="mt-0">
            <motion.div {...fade} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="answer-key" className="flex items-center gap-1.5">
                  <KeyRound className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  Teacher answer key
                </Label>
                <span className="text-xs text-muted-foreground">Students never see this</span>
              </div>
              <Textarea
                id="answer-key"
                value={draft.answerKey}
                onChange={(e) => updateDraft({ answerKey: e.target.value, criteriaConfirmed: false })}
                placeholder="Paste or type the expected answers. The AI uses this as its reference when scoring."
                rows={10}
                className="text-sm leading-relaxed" />
              
            </motion.div>
          </TabsContent>
          <TabsContent value="submissions" className="mt-0">
            <motion.div {...fade}>
              <SubmissionPreviewList submissions={submissions} />
            </motion.div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>);

}