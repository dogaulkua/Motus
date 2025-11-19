import AsyncStorage from '@react-native-async-storage/async-storage';
import { CaptureSession } from '@types';

const STORAGE_KEY = '@smile_hair_sessions_v1';

export const loadSessions = async (): Promise<CaptureSession[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as CaptureSession[];
  } catch (error) {
    console.error('Failed to load sessions', error);
    return [];
  }
};

export const saveSessions = async (sessions: CaptureSession[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save sessions', error);
  }
};

export const clearSessions = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear sessions', error);
  }
};
