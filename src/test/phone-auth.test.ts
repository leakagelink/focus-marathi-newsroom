import {describe,it,expect} from 'vitest';
import {normalizePhone} from '@/lib/phone-auth';
describe('Phone login numbers',()=>{
 it('adds India code to a ten-digit mobile number',()=>expect(normalizePhone('9876543210')).toBe('+919876543210'));
 it('preserves a full international number',()=>expect(normalizePhone('+91 98765 43210')).toBe('+919876543210'));
 it('rejects incomplete numbers',()=>expect(normalizePhone('12345')).toBe(null));
});