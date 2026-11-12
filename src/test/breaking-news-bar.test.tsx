import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { BreakingNewsBar } from '@/components/public/BreakingNewsBar';

afterEach(cleanup);

it('scrolls all admin breaking headlines together and reflects edited data', () => {
  const items = [
    { id: 'one', text: 'पहिली बातमी', region: 'पुणे', minutes: 30, createdAt: '2026-11-12T07:00:00Z' },
    { id: 'two', text: 'दुसरी बातमी', region: 'नांदेड', minutes: 30, createdAt: '2026-11-12T07:01:00Z' },
  ];
  const { rerender } = render(<BreakingNewsBar items={items} />);
  expect(screen.getAllByText(items[0].text).length).toBeGreaterThan(0);
  expect(screen.getAllByText(items[1].text).length).toBeGreaterThan(0);
  rerender(<BreakingNewsBar items={[{ ...items[0], text: 'सुधारित बातमी' }]} />);
  expect(screen.getAllByText('सुधारित बातमी').length).toBeGreaterThan(0);
});
