import { AngleConfig } from '@types';

export interface Orientation {
  pitch: number;
  roll: number;
  yaw: number;
}

export const defaultOrientation: Orientation = {
  pitch: 0,
  roll: 0,
  yaw: 0
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const radToDeg = (rad: number) => (rad * 180) / Math.PI;

export const calculateOrientationFromAccelerometer = (x: number, y: number, z: number): Orientation => {
  const pitch = radToDeg(Math.atan2(-x, Math.sqrt(y * y + z * z)));
  const roll = radToDeg(Math.atan2(y, z));
  const yaw = radToDeg(Math.atan2(x, y));
  return { pitch, roll, yaw };
};

export const getAlignmentScore = (orientation: Orientation, config: AngleConfig): number => {
  const pitchDelta = Math.abs(orientation.pitch - config.targetPitch);
  const rollDelta = Math.abs(orientation.roll - config.targetRoll);
  const yawDelta = Math.abs(orientation.yaw - config.targetYaw);
  const normalizedPitch = 1 - clamp(pitchDelta / 25, 0, 1);
  const normalizedRoll = 1 - clamp(rollDelta / 25, 0, 1);
  const normalizedYaw = 1 - clamp(yawDelta / 25, 0, 1);
  const score = (normalizedPitch + normalizedRoll + normalizedYaw) / 3;
  return Number(score.toFixed(2));
};

export const describeAlignment = (score: number) => {
  if (score > 0.9) {
    return 'locked';
  }
  if (score > 0.75) {
    return 'almost';
  }
  if (score > 0.5) {
    return 'adjust';
  }
  return 'far';
};
