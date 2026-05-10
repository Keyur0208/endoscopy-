import type { IConfigurationModule } from './type';

export const isValueInConfig = (
  configs: IConfigurationModule[] | undefined,
  key: string,
  value: string
): boolean => {
  if (!Array.isArray(configs)) return false;

  const config = configs.find((c) => c.fieldKey === key);

  if (!config || config.fieldType !== 'select') return false;

  try {
    let configValue = config.value;

    if (typeof configValue === 'string') {
      try {
        configValue = JSON.parse(configValue);
      } catch {
        return configValue === value;
      }
    }
    if (Array.isArray(configValue)) {
      return configValue.includes(value);
    }
    return configValue === value;
  } catch (error) {
    console.error(`Error parsing config value for key: ${key}`, error);
    return false;
  }
};
