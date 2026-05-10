import type { IConfigurationModule } from './type';

const parseBooleanValue = (value?: string | null): boolean => {
  if (!value) return false;
  try {
    const parsed = JSON.parse(value);
    return parsed === true;
  } catch {
    return value === 'true';
  }
};

export const getConfigBoolean = (
  configs: IConfigurationModule[] | undefined,
  key: string
): boolean => {
  if (!Array.isArray(configs)) return false;

  const config = configs.find((c) => c.fieldKey === key);

  return parseBooleanValue(config?.value);
};
