import * as SecureStore from 'expo-secure-store';

const EMAIL_KEY = 'fd_email';
const PIN_KEY = 'fd_pin';
const BIOMETRIC_PREFERRED_KEY = 'fd_biometric_preferred';

export const saveEmail = async (email: string) => {
  await SecureStore.setItemAsync(EMAIL_KEY, email);
};

export const getEmail = async () => {
  return SecureStore.getItemAsync(EMAIL_KEY);
};

export const savePin = async (pin: string) => {
  await SecureStore.setItemAsync(PIN_KEY, pin);
};

export const getPin = async () => {
  return SecureStore.getItemAsync(PIN_KEY);
};

export const clearAuth = async () => {
  await SecureStore.deleteItemAsync(EMAIL_KEY);
  await SecureStore.deleteItemAsync(PIN_KEY);
  await SecureStore.deleteItemAsync(BIOMETRIC_PREFERRED_KEY);
};

export const setBiometricPreferred = async (preferred: boolean) => {
  await SecureStore.setItemAsync(BIOMETRIC_PREFERRED_KEY, preferred ? 'true' : 'false');
};

export const getBiometricPreferred = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(BIOMETRIC_PREFERRED_KEY);
  return value === 'true';
};

