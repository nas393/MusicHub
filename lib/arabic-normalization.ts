const ARABIC_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const TATWEEL = /\u0640/g;
const NON_SEARCH_PUNCTUATION = /[^\p{L}\p{N}\s]/gu;
const WHITESPACE = /\s+/g;

/**
 * Produces a search key, not a replacement for the original display string.
 * It intentionally preserves ta marbuta (ة) to avoid overly broad matches.
 */
export function normalizeArabicText(value: string): string {
  return value
    .normalize('NFKC')
    .replace(ARABIC_DIACRITICS, '')
    .replace(TATWEEL, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ء/g, '')
    .replace(NON_SEARCH_PUNCTUATION, ' ')
    .toLocaleLowerCase()
    .replace(WHITESPACE, ' ')
    .trim();
}

export function matchesArabicQuery(value: string, query: string): boolean {
  const normalizedQuery = normalizeArabicText(query);
  if (!normalizedQuery) return true;
  return normalizeArabicText(value).includes(normalizedQuery);
}
