import type { NewsStatus } from '@/types';
export const isPublished = (status:NewsStatus) => status==='approved'||status==='broadcasted';
export const hasPublishedBulletin = (ids: string[], news: {id:string;status:NewsStatus}[]) => ids.some(id => news.some(n => n.id === id && isPublished(n.status)));