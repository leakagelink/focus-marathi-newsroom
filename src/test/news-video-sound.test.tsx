import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { NewsVideo } from '@/components/NewsVideo';

const originalPlay = HTMLMediaElement.prototype.play;

beforeEach(() => {
  HTMLMediaElement.prototype.play = vi.fn().mockRejectedValue(new DOMException('blocked', 'NotAllowedError')) as never;
});

afterEach(() => {
  HTMLMediaElement.prototype.play = originalPlay;
});

it('attempts to start uploaded clips with sound, never muted first', async () => {
  const mutedAtPlay: boolean[] = [];
  HTMLMediaElement.prototype.play = vi.fn(function (this: HTMLVideoElement) {
    mutedAtPlay.push(this.muted);
    return Promise.reject(new DOMException('blocked', 'NotAllowedError'));
  }) as never;
  const { container } = render(<NewsVideo src="https://example.org/reporter/location.mp4" label="Location" autoPlay />);
  await new Promise(r => setTimeout(r, 0));
  expect(container.querySelector('video')?.hasAttribute('muted')).toBe(false);
  expect(mutedAtPlay[0]).toBe(false);
});

it('offers one-tap sound when the browser blocks audible autoplay', async () => {
  const { container, findByRole, queryByRole } = render(<NewsVideo src="https://example.org/reporter/location.mp4" label="Location" autoPlay />);
  const button = await findByRole('button', { name: /आवाज सुरू करा/ });
  fireEvent.click(button);
  expect(queryByRole('button', { name: /आवाज सुरू करा/ })).toBeNull();
  expect(container.querySelector('video')?.muted).toBe(false);
});

it('keeps small clip previews silent and uncontrolled', () => {
  const { container } = render(<NewsVideo src="https://example.org/reporter/location.mp4" label="Location" preview />);
  const video = container.querySelector('video');
  expect(video?.controls).toBe(false);
  expect(video?.hasAttribute('muted')).toBe(false);
});
