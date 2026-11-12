import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { NewsVideo } from '@/components/NewsVideo';

afterEach(cleanup);

it('plays the exact uploaded source and replaces the old media on a story change', () => {
  const { container, rerender } = render(<NewsVideo src="https://example.org/reporter/location.webm" label="Location" />);
  const previous = container.querySelector('video');
  expect(previous?.getAttribute('src')).toBe('https://example.org/reporter/location.webm');
  expect(previous?.getAttribute('poster')).toBeNull();
  rerender(<NewsVideo src="https://example.org/other-reporter/location.mp4" label="Location" />);
  expect(container.querySelector('video')).not.toBe(previous);
  expect(container.querySelector('video')?.getAttribute('src')).toBe('https://example.org/other-reporter/location.mp4');
});

it('reports a failed uploaded clip rather than substituting another video', () => {
  const { container, rerender } = render(<NewsVideo src="https://example.org/broken.webm" label="Clip" />);
  const video = container.querySelector('video');
  if (!video) throw new Error('Missing player');
  fireEvent.error(video);
  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(container.querySelector('video')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'पुन्हा प्रयत्न करा' }));
  expect(container.querySelector('video')?.getAttribute('src')).toBe('https://example.org/broken.webm');
  rerender(<NewsVideo src={undefined} label="Clip" />);
  expect(container.querySelector('video')).toBeNull();
});