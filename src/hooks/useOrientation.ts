import { useEffect, useState, useCallback } from 'react';
import { DeviceMotion } from 'expo-sensors';
import { Platform } from 'react-native';
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

    if (Platform.OS !== 'web') {
      DeviceMotion.setUpdateInterval(100);
    }
    
    let subscription: { remove: () => void } | undefined;

    const handleMotionUpdate = (motionData: any) => {
      if (motionData.rotation) {
        const { alpha, beta, gamma } = motionData.rotation;
        const nextOrientation = calculateOrientationFromAccelerometer(alpha, beta, gamma);
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
      }
    };

    const handleError = (error: any) => {
      console.warn('Sensor error', error);
      setHasSensorAccess(false);
    };

    // Request permission and start listening
    (async () => {
      try {
        const { status } = await DeviceMotion.requestPermissionsAsync();
        if (status === 'granted') {
          subscription = DeviceMotion.addListener(handleMotionUpdate);
        } else {
          setHasSensorAccess(false);
        }
      } catch (error) {
        console.warn('Failed to get motion permission', error);
        setHasSensorAccess(false);
      }
    })();

    return () => {
      subscription?.remove();
    };
  }, [config, enabled]);

  return { orientation, score, descriptor, hasSensorAccess };
};
