import { expect, it } from 'vitest';
import { mainCategories, subCategories, matchesCategory } from '@/lib/categories';
const rows = [{ id: '1', name: 'राजकारण', data: {} }, { id: '2', name: 'निवडणूक', data: { parent: 'राजकारण' } }, { id: '3', name: 'शेती', data: {} }];
it('splits main and sub categories', () => {
  expect(mainCategories(rows).map(r => r.name)).toEqual(['राजकारण', 'शेती']);
  expect(subCategories(rows, 'राजकारण').map(r => r.name)).toEqual(['निवडणूक']);
});
it('parent filter includes subcategory stories, sub filter does not include parent', () => {
  expect(matchesCategory(rows, 'निवडणूक', 'राजकारण')).toBe(true);
  expect(matchesCategory(rows, 'राजकारण', 'निवडणूक')).toBe(false);
  expect(matchesCategory(rows, 'शेती', 'राजकारण')).toBe(false);
});
