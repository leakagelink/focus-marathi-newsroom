import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('@/lib/store', () => ({
  useStore: (selector: (state: unknown) => unknown) => selector({
    news: [], content: [], breaking: [], ads: [], bulletin: null, bulletinPublished: false, onAir: false, nowPlaying: '',
  }),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { PublicApp } from '@/components/public/PublicApp';
import { SPLASH_SLOGAN } from '@/lib/slogan';

afterEach(cleanup);

it('shows the FOCUS 24 slogan on the splash screen', () => {
  render(<PublicApp />);
  expect(screen.getByText(SPLASH_SLOGAN)).toBeInTheDocument();
});
