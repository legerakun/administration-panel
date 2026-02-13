export type ProductDraft = {
  title: string;
  price: string;
  brand: string;
  sku: string;
};

export const validateDraft = (draft: ProductDraft): Partial<Record<keyof ProductDraft, string>> => {
  const errors: Partial<Record<keyof ProductDraft, string>> = {};
  if (!draft.title.trim()) errors.title = 'Введите наименование';
  if (!draft.brand.trim()) errors.brand = 'Введите вендора';
  if (!draft.sku.trim()) errors.sku = 'Введите артикул';
  const price = Number(draft.price);
  if (!draft.price.trim()) errors.price = 'Введите цену';
  else if (!Number.isFinite(price) || price <= 0) errors.price = 'Цена должна быть числом > 0';
  return errors;
};
