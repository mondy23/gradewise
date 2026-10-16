import { Criterion, FlagReason, GradeResult, Submission } from '../types/grading';

export function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function createQueuedResult(submissionId: string): GradeResult {
  return {
    submissionId,
    status: 'queued',
    scores: {},
    aiScores: {},
    rationale: {},
    confidence: 0,
    flags: [],
    feedback: '',
    approved: false,
    adjusted: false,
    attempts: 0
  };
}

export function gradeSubmission(
submission: Submission,
criteria: Criterion[])
: Pick<GradeResult, 'scores' | 'aiScores' | 'rationale' | 'confidence' | 'flags' | 'feedback'> {
  const { sample } = submission;
  const scores: Record<string, number> = {};
  const rationale: Record<string, string> = {};
  const missing = !submission.submittedAt;

  criteria.forEach((c) => {
    if (missing) {
      scores[c.id] = 0;
      rationale[c.id] = 'No work was submitted.';
      return;
    }
    const jitter = (hashString(submission.id + c.id) % 21 - 10) / 100;
    const q = clamp(sample.quality + jitter, 0, 1);
    scores[c.id] = Math.round(q * c.points * 2) / 2;
    rationale[c.id] =
    q >= 0.85 ?
    `Fully addresses “${c.title}” and closely matches the reference.` :
    q >= 0.6 ?
    `Partially addresses “${c.title}”; some key points are missing or imprecise.` :
    `Little evidence of “${c.title}”; key ideas are missing or incorrect.`;
  });

  const flags: FlagReason[] = [];
  if (sample.flag) flags.push(sample.flag);
  const confidence = missing ?
  0.99 :
  clamp(sample.confidence + (hashString(submission.id) % 7 - 3) / 100, 0.3, 0.99);
  if (confidence < 0.7 && !flags.includes('low-confidence') && !missing) flags.push('low-confidence');

  const feedback = missing ?
  '' :
  sample.quality >= 0.85 ?
  'Excellent work — your response is accurate, complete, and clearly explained.' :
  sample.quality >= 0.6 ?
  'Good effort. Review the criteria where you lost points and add more specific detail.' :
  'Your response is missing several key ideas. Let’s review this together and try a revision.';

  return { scores, aiScores: { ...scores }, rationale, confidence, flags, feedback };
}

export function totalScore(scores: Record<string, number>): number {
  return Object.values(scores).reduce((sum, v) => sum + (Number.isFinite(v) ? v : 0), 0);
}

export function maxScore(criteria: Criterion[]): number {
  return criteria.reduce((sum, c) => sum + (Number.isFinite(c.points) ? c.points : 0), 0);
}

export function needsReview(result: GradeResult): boolean {
  return result.status === 'failed' || result.status === 'graded' && result.flags.length > 0;
}

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export function confidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.85) return 'high';
  if (confidence >= 0.7) return 'medium';
  return 'low';
}

export function suggestCriteria(maxPoints: number, prefix: string): Criterion[] {
  const accuracy = Math.round(maxPoints * 0.5);
  const completeness = Math.round(maxPoints * 0.3);
  const clarity = maxPoints - accuracy - completeness;
  return [
  { id: `${prefix}-g1`, title: 'Accuracy', description: 'Key facts and reasoning match the answer key.', points: accuracy, source: 'ai' },
  { id: `${prefix}-g2`, title: 'Completeness', description: 'Addresses every part of the prompt.', points: completeness, source: 'ai' },
  { id: `${prefix}-g3`, title: 'Clarity', description: 'Explains ideas clearly using appropriate vocabulary.', points: clarity, source: 'ai' }];

}

export function formatPoints(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function initials(name: string): string {
  return name.
  split(' ').
  map((p) => p[0]).
  slice(0, 2).
  join('').
  toUpperCase();
}