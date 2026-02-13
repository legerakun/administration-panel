const { VITE_BASE_URL } = import.meta.env;

const base = VITE_BASE_URL || '/administration-panel/';

export const PATH = {
  INDEX: base,
  LOGIN: `${base}login`,
  PRODUCTS: `${base}products`
};
