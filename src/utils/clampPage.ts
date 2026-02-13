export const clampPage = (p: number, pages: number) => {
  if (pages <= 1) return 1;
  return Math.min(Math.max(1, p), pages);
};
