import { MEDIA_URL } from '@/utils/constants';

export const resolveMediaUrl = (path?: string | null) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${MEDIA_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};


