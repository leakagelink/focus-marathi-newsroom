import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NewsAudio } from '@/components/public/NewsAudio';

function device(voices: {lang: string}[]) {
  const engine = { getVoices: () => voices, addEventListener: vi.fn(), removeEventListener: vi.fn(), cancel: vi.fn(), speak: vi.fn(), pause: vi.fn(), resume: vi.fn() };
  vi.stubGlobal('speechSynthesis', engine);
  vi.stubGlobal('SpeechSynthesisUtterance', class { constructor(public text: string) {} });
  return engine;
}
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
describe('Device news listening', () => {
  it('reads the actual headline and script with the Marathi device voice', () => {
    const engine = device([{lang:'hi-IN'}, {lang:'mr-IN'}]);
    render(<NewsAudio headline="शेतकऱ्यांना मदत" script="आज मदत जाहीर झाली." />);
    fireEvent.click(screen.getByRole('button', {name:'बातमी ऐका'}));
    const spoken = engine.speak.mock.calls[0]?.[0];
    expect(spoken.text).toBe('शेतकऱ्यांना मदत. आज मदत जाहीर झाली.');
    expect(spoken.lang).toBe('mr-IN');
  });
  it('pauses, resumes, stops and cancels when the reader leaves', () => {
    const engine = device([{lang:'mr-IN'}]);
    const page = render(<NewsAudio headline="बातमी" script="महाराष्ट्र" />);
    fireEvent.click(screen.getByRole('button', {name:'बातमी ऐका'}));
    fireEvent.click(screen.getByRole('button', {name:'विराम'}));
    expect(engine.pause).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', {name:'पुढे ऐका'}));
    expect(engine.resume).toHaveBeenCalledOnce();
    engine.cancel.mockClear();
    fireEvent.click(screen.getByRole('button', {name:'थांबवा'}));
    expect(engine.cancel).toHaveBeenCalledOnce();
    page.unmount();
    expect(engine.cancel).toHaveBeenCalledTimes(2);
  });
  it('uses Hindi when Marathi is missing and never selects an unrelated voice', () => {
    const engine = device([{lang:'en-US'}, {lang:'hi-IN'}]);
    const page = render(<NewsAudio headline="बातमी" script="महाराष्ट्र" />);
    fireEvent.click(screen.getByRole('button', {name:'बातमी ऐका'}));
    expect(engine.speak.mock.calls[0]?.[0].lang).toBe('hi-IN');
    page.unmount();
    device([{lang:'en-US'}]);
    render(<NewsAudio headline="बातमी" script="महाराष्ट्र" />);
    expect(screen.getByRole('button', {name:'बातमी ऐका'})).toBeDisabled();
  });
  it('returns to idle when device speech completes', () => {
    const engine = device([{lang:'mr-IN'}]);
    render(<NewsAudio headline="बातमी" script="महाराष्ट्र" />);
    fireEvent.click(screen.getByRole('button', {name:'बातमी ऐका'}));
    act(() => engine.speak.mock.calls[0]?.[0].onend());
    expect(engine.speak).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', {name:'बातमी ऐका'}));
    expect(engine.speak).toHaveBeenCalledTimes(2);
  });
});