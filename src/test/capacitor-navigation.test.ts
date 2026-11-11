import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const config = JSON.parse(readFileSync('capacitor.config.json', 'utf8'));

describe('Android newsroom navigation', () => {
  it('starts on the custom domain instead of the redirecting published address', () => {
    expect(config.server.url).toBe('https://news.homemuse.in');
  });

  it('allows only the newsroom host inside the app', () => {
    expect(config.server.allowNavigation).toEqual(['news.homemuse.in']);
  });

  it('keeps cleartext traffic disabled', () => {
    expect(config.server.cleartext).toBe(false);
  });
});