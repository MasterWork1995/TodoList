export const normalizeForSearch = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

const levenshtein = (a: string, b: string): number => {
  const an = a.length;
  const bn = b.length;
  const matrix: number[][] = Array(an + 1)
    .fill(null)
    .map(() => Array(bn + 1).fill(0));
  for (let i = 0; i <= an; i++) matrix[i][0] = i;
  for (let j = 0; j <= bn; j++) matrix[0][j] = j;
  for (let i = 1; i <= an; i++) {
    for (let j = 1; j <= bn; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[an][bn];
};

export const fuzzyMatch = (text: string, query: string): boolean => {
  const nText = normalizeForSearch(text);
  const nQuery = normalizeForSearch(query);
  if (!nQuery) return true;
  if (nText.includes(nQuery)) return true;
  const words = nText.split(/\s+/);
  const qWords = nQuery.split(/\s+/).filter(Boolean);
  if (qWords.every((qw) => words.some((w) => w.includes(qw) || w === qw)))
    return true;
  const maxLen = Math.max(nText.length, nQuery.length);
  if (maxLen === 0) return true;
  const distance = levenshtein(nText.slice(0, 80), nQuery.slice(0, 80));
  return distance / maxLen <= 0.5;
};

export const highlightChunks = (
  text: string,
  query: string
): { type: 'match' | 'text'; value: string }[] => {
  if (!query.trim()) return [{ type: 'text', value: text }];
  const nQuery = normalizeForSearch(query);
  const normalized = normalizeForSearch(text);
  const chunks: { type: 'match' | 'text'; value: string }[] = [];
  let lastIndex = 0;
  let pos = 0;
  while (pos < text.length) {
    const normSlice = normalized.slice(pos);
    const idx = normSlice.indexOf(nQuery);
    if (idx === -1) {
      chunks.push({ type: 'text', value: text.slice(pos) });
      break;
    }
    const start = pos + idx;
    const end = start + query.length;
    const actualEnd = Math.min(end, text.length);
    if (start > lastIndex) {
      chunks.push({ type: 'text', value: text.slice(lastIndex, start) });
    }
    chunks.push({ type: 'match', value: text.slice(start, actualEnd) });
    lastIndex = actualEnd;
    pos = actualEnd;
  }
  return chunks;
};
