import { describe,it,expect } from 'vitest';
import { submissionSchema } from '@/lib/news-validation';
const input = (words:number) => ({headline:'महाराष्ट्रातील शेतकऱ्यांची बातमी',script:Array(words).fill('महाराष्ट्र').join(' '),category:'शेती',districtId:'satara',constituency:'कराड दक्षिण',clipPaths:{location:'u/l',anchor:'u/a',byte1:'u/b1',byte2:'u/b2'},aiVoice:false});
describe('Live news submission rules',()=>{
 it('requires at least 80 script words',()=>{ expect(submissionSchema.safeParse(input(79)).success).toBe(false); expect(submissionSchema.safeParse(input(80)).success).toBe(true); });
 it('allows no more than 100 script words',()=>{ expect(submissionSchema.safeParse(input(100)).success).toBe(true); expect(submissionSchema.safeParse(input(101)).success).toBe(false); });
 it('requires all four video paths',()=>{ const n=input(80); n.clipPaths.byte2=''; expect(submissionSchema.safeParse(n).success).toBe(false); expect(submissionSchema.safeParse(input(80)).success).toBe(true); });
});