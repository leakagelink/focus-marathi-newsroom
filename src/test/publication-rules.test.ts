import {describe,it,expect} from 'vitest';
import {isPublished} from '@/lib/public-news';
describe('Approval-first publication',()=>{
 it('hides newly submitted pending news',()=>expect(isPublished('pending')).toBe(false));
 it('shows accepted news',()=>expect(isPublished('approved')).toBe(true));
 it('hides rejected news',()=>expect(isPublished('rejected')).toBe(false));
 it('hides news sent back for revision',()=>expect(isPublished('revision')).toBe(false));
 it('shows approved broadcast news',()=>expect(isPublished('broadcasted')).toBe(true));
});