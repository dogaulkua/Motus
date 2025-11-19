import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AngleId } from '@types';
import { ANGLES } from '@constants/angles';

interface Props {
  currentAngle: AngleId;
}

const AngleProgress: React.FC<Props> = ({ currentAngle }) => {
  return (
    <View style={styles.container}>
      {ANGLES.map((angle) => {
        const isActive = angle.id === currentAngle;
        return (
          <View key={angle.id} style={[styles.step, isActive && styles.stepActive]}>
            <Text style={[styles.stepText, isActive && styles.stepTextActive]}>{angle.id.toUpperCase()}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    gap: 8
  },
  step: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#475569'
  },
  stepActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb'
  },
  stepText: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600'
  },
  stepTextActive: {
    color: '#f8fafc'
  }
});

export default AngleProgress;
