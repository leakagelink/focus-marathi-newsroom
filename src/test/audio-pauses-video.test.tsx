import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { NewsVideo } from '@/components/NewsVideo';
import { requestMediaPause } from '@/lib/media-focus';

const originalPlay = HTMLMediaElement.prototype.play;

beforeEach(() => {
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined) as never;
});

afterEach(() => {
  HTMLMediaElement.prototype.play = originalPlay;
  cleanup();
});

it('pauses the story player as soon as news narration starts', () => {
  const { container } = render(<NewsVideo src="https://example.org/reporter/location.mp4" label="Location" autoPlay />);
  const video = container.querySelector('video');
  if (!video) throw new Error('Missing player');
  const pause = vi.spyOn(video, 'pause');
  requestMediaPause();
  expect(pause).toHaveBeenCalled();
});

it('leaves list preview thumbnails alone when narration starts', () => {
  const { container } = render(<NewsVideo src="https://example.org/reporter/location.mp4" label="Preview" preview />);
  const video = container.querySelector('video');
  if (!video) throw new Error('Missing preview');
  const pause = vi.spyOn(video, 'pause');
  requestMediaPause();
  expect(pause).not.toHaveBeenCalled();
});
