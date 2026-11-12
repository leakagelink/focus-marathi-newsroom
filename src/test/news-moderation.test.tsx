import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { NewsManager } from '@/components/admin/NewsManager';

const mocks = vi.hoisted(() => ({ update: vi.fn(), eq: vi.fn(), single: vi.fn(), refresh: vi.fn(), select: vi.fn() }));
vi.mock('@/lib/store', () => ({
  useStore: (selector: (state: unknown) => unknown) => selector({
    userId: 'admin-1', journalists: [{ id: 'reporter-1', name: 'Reporter' }],
    news: [{ id: 'post-1', headline: 'Reporter post', script: 'News script', reporterId: 'reporter-1', status: 'pending', createdAt: '2026-11-12T03:18:00Z', clipUrls: {} }],
  }), refreshCloud: mocks.refresh, actions: { submitNews: vi.fn() },
}));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: () => ({ update: mocks.update }) } }));
vi.mock('@/components/journalist/JournalistApp', () => ({ statusMeta: { pending: { l: 'प्रलंबित' }, approved: { l: 'मंजूर' } } }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
beforeEach(() => {
  vi.clearAllMocks();
  mocks.update.mockReturnValue({ eq: mocks.eq });
  mocks.eq.mockReturnValue({ select: mocks.select });
  mocks.select.mockReturnValue({ single: mocks.single });
  mocks.single.mockResolvedValue({ error: null });
  mocks.refresh.mockResolvedValue(undefined);
});
afterEach(cleanup);

it('approves a pending reporter post without opening its details first', async () => {
  render(<NewsManager />);
  fireEvent.click(screen.getByRole('button', { name: 'मंजूर व प्रकाशित' }));
  await waitFor(() => expect(mocks.update).toHaveBeenCalledWith({ status: 'approved', feedback: null }));
  expect(mocks.eq).toHaveBeenCalledWith('id', 'post-1');
  await waitFor(() => expect(mocks.refresh).toHaveBeenCalledOnce());
});

it('rejects a pending reporter post without opening its details first', async () => {
  render(<NewsManager />);
  fireEvent.click(screen.getByRole('button', { name: 'नकार' }));
  await waitFor(() => expect(mocks.update).toHaveBeenCalledWith({ status: 'rejected', feedback: null }));
  expect(mocks.eq).toHaveBeenCalledWith('id', 'post-1');
});