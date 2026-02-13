export const formatRating = (r: number | undefined) => {
  if (typeof r !== 'number' || !Number.isFinite(r)) return '—';
  return `${r.toFixed(1)}/5`;
};
