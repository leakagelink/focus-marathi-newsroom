import type { NewsStatus } from '@/types';
export const isPublished = (status:NewsStatus) => status==='approved'||status==='broadcasted';