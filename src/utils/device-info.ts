import { UAParser } from 'ua-parser-js';

const DEVICE_NAME_KEY = 'family_app.device_name';

export const getDeviceName = (): string => {
  const stored = localStorage.getItem(DEVICE_NAME_KEY);
  if (stored) return stored;

  const { browser, os } = new UAParser().getResult();
  const label =
    [browser.name, os.name].filter(Boolean).join(' on ') || 'Unknown device';

  localStorage.setItem(DEVICE_NAME_KEY, label);
  return label;
};

export const setDeviceName = (name: string): void => {
  localStorage.setItem(DEVICE_NAME_KEY, name);
};
