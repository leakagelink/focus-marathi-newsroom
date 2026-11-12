import { expect, it } from 'vitest';
import { adsFor, AD_SIZES, AD_PLACEMENTS } from '@/lib/ads';
it('shows only active ads for the chosen placement', () => {
  const ads = [{ id: 'a', placement: 'home_top', active: true }, { id: 'b', placement: 'home_top', active: false }, { id: 'c', placement: 'detail_bottom', active: true }];
  expect(adsFor(ads, 'home_top').map(a => a.id)).toEqual(['a']);
});
it('offers four sizes and four placements', () => { expect(AD_SIZES).toHaveLength(4); expect(AD_PLACEMENTS).toHaveLength(4); });
