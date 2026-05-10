import { CategorType } from 'endoscopy-shared';

export const CATEGORY_TYPE = Object.values(CategorType).map((option) => ({
  label: option,
  value: option,
}));
