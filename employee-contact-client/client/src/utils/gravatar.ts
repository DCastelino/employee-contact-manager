import md5 from 'md5';

// Cache for Gravatar URLs to avoid recalculating hashes
const gravatarCache = new Map<string, string>();


export const getGravatarUrl = (email: string, size = 80): string => {
  if (!email) return '';
  
  const cacheKey = `${email}:${size}`;
  
  // Return cached URL if available
  if (gravatarCache.has(cacheKey)) {
    return gravatarCache.get(cacheKey)!;
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  const hash = md5(trimmedEmail); // hash using md5 package
  
  const url = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=404&r=g`;
  
  gravatarCache.set(cacheKey, url);
  
  return url;
};


export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  const first = parts[0]?.charAt(0)?.toUpperCase() || '';
  const last = parts[1]?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
};


// autogen string colour hasher
export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const color = Math.abs(hash).toString(16).substring(0, 6);
  return `#${'000000'.substring(0, 6 - color.length) + color}`;
};
