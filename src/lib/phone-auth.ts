export function normalizePhone(input: string): string | null {
  const compact = input.replace(/[\s()-]/g, '');
  if (/^[6-9]\d{9}$/.test(compact)) return `+91${compact}`;
  if (/^\+[1-9]\d{7,14}$/.test(compact)) return compact;
  return null;
}