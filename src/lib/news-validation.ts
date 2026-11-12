import { z } from 'zod';

export const CLIP_DURATION_SECONDS = { location: 5, anchor: 25, byte1: 60, byte2: 60 } as const;

export const submissionSchema = z.object({
  headline: z.string().trim().min(10).max(120),
  script: z.string().trim().refine((s) => { const n = s.split(/\s+/).length; return n >= 80 && n <= 100; }, 'स्क्रिप्ट 80 ते 100 शब्दांची असावी'),
  category: z.string().trim().min(1).max(100),
  districtId: z.string().min(1), constituency: z.string().min(1),
  clipPaths: z.object({ location: z.string().min(1).optional(), anchor: z.string().min(1).optional(), byte1: z.string().min(1).optional(), byte2: z.string().min(1).optional() }).strict().refine(p => Object.keys(p).length === 0 || ['location','anchor','byte1','byte2'].every(k => Boolean(p[k as keyof typeof p])), 'चारही क्लिप जोडा किंवा मजकूर बातमी निवडा'),
  aiVoice: z.boolean(),
});