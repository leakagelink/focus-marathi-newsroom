export const AD_PLACEMENTS = [
  { value: 'home_top', label: 'होम – व्हिडिओखाली' },
  { value: 'home_feed', label: 'होम – बातम्यांच्या वर' },
  { value: 'detail_top', label: 'बातमी – व्हिडिओखाली' },
  { value: 'detail_bottom', label: 'बातमी – शेवटी' },
] as const;
export const AD_SIZES = [
  { value: 'small', label: 'लहान पट्टी (320×50)' },
  { value: 'medium', label: 'मध्यम (320×100)' },
  { value: 'large', label: 'मोठी (300×250)' },
  { value: 'full', label: 'पूर्ण रुंदी (16:9)' },
] as const;
export type AdPlacement = (typeof AD_PLACEMENTS)[number]['value'];
export type AdSize = (typeof AD_SIZES)[number]['value'];
export const AD_SIZE_CLASS: Record<AdSize, string> = {
  small: 'h-[50px]', medium: 'h-[100px]', large: 'h-[250px]', full: 'aspect-video',
};
export const isAdSize = (v: unknown): v is AdSize => AD_SIZES.some(s => s.value === v);
export const isAdPlacement = (v: unknown): v is AdPlacement => AD_PLACEMENTS.some(p => p.value === v);
export function adsFor<T extends { placement: string; active: boolean }>(ads: T[], placement: AdPlacement) {
  return ads.filter(a => a.active && a.placement === placement);
}
