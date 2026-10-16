import { FlagReason } from '../types/grading';

export const FLAG_META: Record<FlagReason, {label: string;description: string;}> = {
  'low-confidence': {
    label: 'Low confidence',
    description: 'The AI wasn’t sure how to score this response against your criteria.'
  },
  incomplete: {
    label: 'Possibly incomplete',
    description: 'The response appears to skip or cut off parts of the prompt.'
  },
  missing: {
    label: 'No submission',
    description: 'This student hasn’t turned in work. Scored 0 until you decide otherwise.'
  },
  'off-key': {
    label: 'Differs from key',
    description: 'Uses reasoning not covered by your answer key — it may still be correct.'
  },
  unreadable: {
    label: 'Hard to read',
    description: 'Part of the attachment was difficult to read. Check the original in Classroom.'
  }
};