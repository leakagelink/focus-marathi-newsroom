import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { LiveClock } from '@/components/LiveClock';
import { NewsVideo } from '@/components/NewsVideo';

const dateFmt = new Intl.DateTimeFormat('mr-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('mr-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

const at = (iso: string) => ({ date: dateFmt.format(new Date(iso)), time: timeFmt.format(new Date(iso)) });

afterEach(() => { cleanup(); vi.useRealTimers(); });

it('shows the live Marathi date and a time that advances every second', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-12T09:00:40Z'));
  render(<LiveClock />);
  const first = at('2026-11-12T09:00:40Z');
  expect(screen.getByText(first.date)).toBeInTheDocument();
  expect(screen.getByText(first.time)).toBeInTheDocument();
  act(() => { vi.advanceTimersByTime(1000); });
  const second = at('2026-11-12T09:00:41Z');
  expect(screen.getByText(second.time)).toBeInTheDocument();
  expect(screen.queryByText(first.time)).toBeNull();
});

it('keeps date and time inside the full video player but not inside small previews', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-12T09:00:40Z'));
  const { time } = at('2026-11-12T09:00:40Z');
  const { container, unmount } = render(<NewsVideo src="https://example.org/reporter/location.mp4" label="Location" />);
  expect(container.querySelector('video')).not.toBeNull();
  expect(screen.getByText(time)).toBeInTheDocument();
  unmount();
  render(<NewsVideo src="https://example.org/reporter/location.mp4" label="Location" preview />);
  expect(screen.queryByText(time)).toBeNull();
});
