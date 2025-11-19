export type AngleId = 'front' | 'right45' | 'left45' | 'top' | 'donor';

export interface AngleConfig {
  id: AngleId;
  titleKey: string;
  descriptionKey: string;
  tipKey: string;
  targetPitch: number;
  targetRoll: number;
  targetYaw: number;
  silhouette: 'front' | 'profile-right' | 'profile-left' | 'top' | 'donor';
  extraAssist?: boolean;
}

export interface CapturedPhoto {
  angleId: AngleId;
  base64: string;
  timestamp: number;
  uri?: string;
}

export interface CaptureSession {
  id: string;
  locale: string;
  createdAt: number;
  photos: CapturedPhoto[];
  graftEstimation?: GraftEstimationResult;
}

export interface GraftEstimationResult {
  min: number;
  max: number;
  minPrice: number;
  maxPrice: number;
}
