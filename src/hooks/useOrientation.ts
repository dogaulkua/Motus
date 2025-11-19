import { useEffect, useState } from 'react';
import { accelerometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import { Subscription } from 'rxjs';
import { AngleConfig } from '@types';
import {
  Orientation,
  defaultOrientation,
  calculateOrientationFromAccelerometer,
  getAlignmentScore
} from '@utils/orientation';

interface UseOrientationResult {
  orientation: Orientation;
  score: number;
  descriptor: 'locked' | 'almost' | 'adjust' | 'far';
  hasSensorAccess: boolean;
}

export const useOrientation = (config?: AngleConfig, enabled = true): UseOrientationResult => {
  const [orientation, setOrientation] = useState<Orientation>(defaultOrientation);
  const [score, setScore] = useState(0);
  const [descriptor, setDescriptor] = useState<'locked' | 'almost' | 'adjust' | 'far'>('far');
  const [hasSensorAccess, setHasSensorAccess] = useState(true);

  useEffect(() => {
    if (!config || !enabled) {
      return;
    }

    setUpdateIntervalForType(SensorTypes.accelerometer, 120);
    let subscription: Subscription | undefined;

    subscription = accelerometer.subscribe(
      ({ x, y, z }) => {
        const nextOrientation = calculateOrientationFromAccelerometer(x, y, z);
        setOrientation(nextOrientation);
        const nextScore = getAlignmentScore(nextOrientation, config);
        setScore(nextScore);
        if (nextScore > 0.9) {
          setDescriptor('locked');
        } else if (nextScore > 0.75) {
          setDescriptor('almost');
        } else if (nextScore > 0.5) {
          setDescriptor('adjust');
        } else {
          setDescriptor('far');
        }
      },
      (error) => {
        console.warn('Sensor error', error);
        setHasSensorAccess(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [config, enabled]);

  return { orientation, score, descriptor, hasSensorAccess };
};
