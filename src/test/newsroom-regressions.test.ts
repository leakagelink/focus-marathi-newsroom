import { expect, it } from 'vitest';
import { sampleNews } from '@/lib/sample-news';
import { submissionSchema } from '@/lib/news-validation';
import { hasPublishedBulletin } from '@/lib/public-news';

it('allows the supplied sample to pass the same 80–100 word submission validation', () => {
  expect(submissionSchema.safeParse({...sampleNews,category:'शेती',districtId:'satara',constituency:'कराड दक्षिण',clipPaths:{},aiVoice:false}).success).toBe(true);
});
it('recognizes a managed bulletin containing an approved story', () => {
  expect(hasPublishedBulletin(['approved-1'],[{id:'approved-1',status:'approved'}])).toBe(true);
});
it('does not mark a bulletin published when every referenced story is pending', () => {
  expect(hasPublishedBulletin(['pending-1'],[{id:'pending-1',status:'pending'}])).toBe(false);
});