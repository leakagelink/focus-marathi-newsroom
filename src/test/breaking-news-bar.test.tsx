import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { BreakingNewsBar } from '@/components/public/BreakingNewsBar';

afterEach(cleanup);

it('navigates the supplied admin breaking headlines and reflects edited data', () => {
  const items = [
    { id: 'one', text: 'पहिली बातमी', region: 'पुणे', minutes: 30, createdAt: '2026-11-12T07:00:00Z' },
    { id: 'two', text: 'दुसरी बातमी', region: 'नांदेड', minutes: 30, createdAt: '2026-11-12T07:01:00Z' },
  ] as const;
  const { rerender } = render(<BreakingNewsBar items={[...items]} />);
  expect(screen.getByText(items[0].text)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'पुढील ब्रेकिंग बातमी' }));
  expect(screen.getByText(items[1].text)).toBeInTheDocument();
  rerender(<BreakingNewsBar items={[{ ...items[0], text: 'सुधारित बातमी' }]} />);
  expect(screen.getByText('सुधारित बातमी')).toBeInTheDocument();
});