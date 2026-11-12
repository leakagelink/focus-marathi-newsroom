import { describe,it,expect } from 'vitest';
import { CLIP_DURATION_SECONDS, getScriptWordStatus, submissionSchema } from '@/lib/news-validation';
const input = (words:number) => ({headline:'महाराष्ट्रातील शेतकऱ्यांची बातमी',script:Array(words).fill('महाराष्ट्र').join(' '),category:'शेती',districtId:'satara',constituency:'कराड दक्षिण',clipPaths:{location:'u/l',anchor:'u/a',byte1:'u/b1',byte2:'u/b2'},aiVoice:false});
describe('Live news submission rules',()=>{
 it('identifies 21 missing words in the reported 59-word script',()=>{ expect(getScriptWordStatus(input(59).script)).toEqual({words:59,valid:false,missing:21,excess:0}); });
 it('counts Marathi whitespace consistently and accepts the inclusive limits',()=>{ expect(getScriptWordStatus('  '+input(80).script.replaceAll(' ','\n\t')+'  ')).toEqual({words:80,valid:true,missing:0,excess:0}); expect(getScriptWordStatus(input(100).script).valid).toBe(true); });
 it('identifies excess words and treats an empty script as zero words',()=>{ expect(getScriptWordStatus(input(101).script)).toEqual({words:101,valid:false,missing:0,excess:1}); expect(getScriptWordStatus('  \n ').words).toBe(0); });
 it('sets Location guidance to 5 seconds',()=>{ expect(CLIP_DURATION_SECONDS.location).toBe(5); });
 it('sets Anchoring guidance to 25 seconds',()=>{ expect(CLIP_DURATION_SECONDS.anchor).toBe(25); });
 it('requires at least 80 script words',()=>{ expect(submissionSchema.safeParse(input(79)).success).toBe(false); expect(submissionSchema.safeParse(input(80)).success).toBe(true); });
 it('allows no more than 100 script words',()=>{ expect(submissionSchema.safeParse(input(100)).success).toBe(true); expect(submissionSchema.safeParse(input(101)).success).toBe(false); });
 it('requires all four video paths',()=>{ const n=input(80); n.clipPaths.byte2=''; expect(submissionSchema.safeParse(n).success).toBe(false); expect(submissionSchema.safeParse(input(80)).success).toBe(true); });
 it('accepts text-only news without any video paths',()=>{ expect(submissionSchema.safeParse({...input(80),clipPaths:{}}).success).toBe(true); });
 it('rejects partial video uploads',()=>{ expect(submissionSchema.safeParse({...input(80),clipPaths:{location:'u/l'}}).success).toBe(false); });
});