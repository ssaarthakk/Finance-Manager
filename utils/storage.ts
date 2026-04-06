import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Persists data to AsyncStorage.
 * @param key The storage key.
 * @param data The data to save (will be stringified).
 */
export const saveToStorage = async <T>(key: string, data: T): Promise<void> => {
  try {
    const serializedData = JSON.stringify(data);
    await AsyncStorage.setItem(key, serializedData);
  } catch (error) {
    console.error(`Error saving data to storage for key ${key}:`, error);
  }
};

/**
 * Retrieves and parses data from AsyncStorage.
 * @param key The storage key.
 * @returns The parsed data, or null if it doesn't exist.
 */
export const getFromStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error(`Error retrieving data from storage for key ${key}:`, error);
    return null;
  }
};

/**
 * Removes data from AsyncStorage.
 * @param key The storage key.
 */
export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data from storage for key ${key}:`, error);
  }
};
