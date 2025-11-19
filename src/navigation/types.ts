import { AngleId } from '@types';

export type RootStackParamList = {
  Home: undefined;
  Capture: { angleId?: AngleId } | undefined;
  SessionReview: { sessionId: string };
  SessionHistory: undefined;
};
