import { beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ from: vi.fn(), getUser: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: { getUser: mocks.getUser }, from: mocks.from } }));
vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); });

it('makes the signed-in profile available before a slow news request completes', async () => {
  let finishNews: ((value: { data: never[]; error: null }) => void) | undefined;
  const news = new Promise<{ data: never[]; error: null }>(resolve => { finishNews = resolve; });
  mocks.getUser.mockResolvedValue({ data: { user: { id: 'reporter-1' } } });
  mocks.from.mockImplementation((table: string) => {
    const result = table === 'news' ? news : Promise.resolve({ error: null, data: table === 'profiles' ? [{ id: 'reporter-1', name: 'Reporter', phone: '', contact_email: '', district_id: '', constituency: '', address: '', bio: '', avatar: '' }] : table === 'user_roles' ? [{ role: 'journalist' }] : table === 'broadcast_settings' ? null : [] });
    const builder = { select: () => builder, eq: () => builder, order: () => builder, limit: () => builder, maybeSingle: () => builder, then: result.then.bind(result) };
    return builder;
  });
  const { refreshCloud, getState } = await import('@/lib/store');
  const refresh = refreshCloud();
  await vi.waitFor(() => expect(getState().ownProfile?.name).toBe('Reporter'));
  expect(getState().ready).toBe(true);
  expect(getState().userId).toBe('reporter-1');
  expect(getState().journalists[0]?.id).toBe('reporter-1');
  finishNews?.({ data: [], error: null });
  await refresh;
});

it('exposes a failed profile load instead of leaving the account waiting indefinitely', async () => {
  mocks.getUser.mockResolvedValue({ data: { user: { id: 'reporter-1' } } });
  mocks.from.mockImplementation((table: string) => {
    const result = Promise.resolve({ data: table === 'broadcast_settings' ? null : [], error: table === 'profiles' ? { message: 'Network unavailable' } : null });
    const builder = { select: () => builder, eq: () => builder, order: () => builder, limit: () => builder, maybeSingle: () => builder, then: result.then.bind(result) };
    return builder;
  });
  const { refreshCloud, getState } = await import('@/lib/store');
  await refreshCloud();
  expect(getState().ready).toBe(true);
  expect(getState().profileError).toBe(true);
  expect(getState().ownProfile).toBeNull();
});