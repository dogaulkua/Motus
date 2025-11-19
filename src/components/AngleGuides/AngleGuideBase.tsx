import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type SilhouetteType = 'front' | 'profile-right' | 'profile-left' | 'top' | 'donor';

export type Descriptor = 'locked' | 'almost' | 'adjust' | 'far';

interface AngleGuideBaseProps {
  title: string;
  description: string;
  tip: string;
  silhouette: SilhouetteType;
  score: number;
  descriptor: Descriptor;
  extraAssistText?: string;
}

const descriptorColors: Record<Descriptor, string> = {
  locked: '#22c55e',
  almost: '#a3e635',
  adjust: '#facc15',
  far: '#f87171'
};

export const AngleGuideBase: React.FC<AngleGuideBaseProps> = ({
  title,
  description,
  tip,
  silhouette,
  score,
  descriptor,
  extraAssistText
}) => {
  const color = descriptorColors[descriptor];

  return (
    <LinearGradient colors={['#111827', '#1f2937']} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={[styles.silhouetteWrapper, { borderColor: color }]}> 
        <View style={[styles.silhouette, variantStyles[silhouette], { borderColor: color }]} />
      </View>

      <View style={styles.scoreRow}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={[styles.scoreValue, { color }]}>{Math.round(score * 100)}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(score, 1) * 100}%`, backgroundColor: color }]} />
      </View>

      <Text style={styles.tipLabel}>Tip</Text>
      <Text style={styles.tip}>{tip}</Text>
      {extraAssistText ? <Text style={styles.extraAssist}>{extraAssistText}</Text> : null}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    gap: 10
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f3f4f6'
  },
  description: {
    fontSize: 14,
    color: '#d1d5db'
  },
  silhouetteWrapper: {
    height: 200,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8
  },
  silhouette: {
    width: 120,
    height: 160,
    borderWidth: 2,
    borderRadius: 60
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scoreLabel: {
    color: '#9ca3af',
    fontSize: 12
  },
  scoreValue: {
    fontWeight: '700',
    fontSize: 18
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#374151'
  },
  progressFill: {
    height: 8,
    borderRadius: 4
  },
  tipLabel: {
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12
  },
  tip: {
    color: '#f3f4f6'
  },
  extraAssist: {
    color: '#93c5fd',
    fontStyle: 'italic'
  }
});

const variantStyles: Record<SilhouetteType, object> = {
  front: {
    width: 120,
    height: 160,
    borderRadius: 60
  },
  'profile-right': {
    width: 110,
    height: 150,
    borderTopRightRadius: 60,
    borderTopLeftRadius: 40,
    borderBottomRightRadius: 60,
    borderBottomLeftRadius: 40,
    transform: [{ skewX: '-5deg' }]
  },
  'profile-left': {
    width: 110,
    height: 150,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 60,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 60,
    transform: [{ skewX: '5deg' }]
  },
  top: {
    width: 160,
    height: 120,
    borderRadius: 80
  },
  donor: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderStyle: 'dashed'
  }
};

export default AngleGuideBase;
