import { expect, it } from 'vitest';
import { ASSEMBLY_REGIONS, DISTRICTS } from '@/data/maharashtra';

it.each([
  ['उत्तर महाराष्ट्र व नाशिक', 35], ['विदर्भ', 62], ['मराठवाडा', 46],
  ['पश्चिम महाराष्ट्र', 70], ['कोकण व मुंबई', 75],
])('%s has %i constituencies', (name, seats) => {
  expect(ASSEMBLY_REGIONS.find(r => r.name === name)?.seats).toBe(seats);
});
it('totals 288 constituencies and assigns all districts once', () => {
  expect(ASSEMBLY_REGIONS.reduce((sum,r) => sum+r.seats, 0)).toBe(288);
  const ids = ASSEMBLY_REGIONS.flatMap(r => r.districtIds);
  expect(ids.length).toBe(36);
  expect(new Set(ids).size).toBe(36);
  expect([...ids].sort()).toEqual(DISTRICTS.map(d => d.id).sort());
});