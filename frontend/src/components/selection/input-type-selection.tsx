import { InputType } from 'endoscopy-shared';

export const INPUT_TYPE_SELECTION = Object.values(InputType).map((option) => ({
  label: option,
  value: option,
}));
