import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ANGLES } from '@constants/angles';
import { ANGLE_PLACEHOLDERS } from '@constants/placeholders';
import { AngleId } from '@types';

interface Props {
  angleId: AngleId;
  base64?: string;
  onRetake: () => void;
}

const PhotoPreviewCard: React.FC<Props> = ({ angleId, base64, onRetake }) => {
  const { t } = useTranslation();
  const angle = ANGLES.find((item) => item.id === angleId);

  return (
    <View style={styles.card}>
      <ImageBackground
        source={{ uri: base64 ? `data:image/jpg;base64,${base64}` : ANGLE_PLACEHOLDERS[angleId] }}
        style={styles.preview}
        imageStyle={styles.previewImage}
      >
        {!base64 ? <Text style={styles.placeholder}>{angle ? t(angle.titleKey) : angleId}</Text> : null}
      </ImageBackground>
      <View style={styles.infoRow}>
        <View>
          <Text style={styles.title}>{angle ? t(angle.titleKey) : angleId.toUpperCase()}</Text>
          <Text style={styles.caption}>{angle ? t(angle.descriptionKey) : ''}</Text>
        </View>
        <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
          <Text style={styles.retakeText}>{t('common.retake')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 10
  },
  preview: {
    height: 180,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center'
  },
  previewImage: {
    borderRadius: 16
  },
  placeholder: {
    color: '#64748b'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: '#f8fafc',
    fontWeight: '700'
  },
  caption: {
    color: '#94a3b8',
    fontSize: 12,
    maxWidth: 200
  },
  retakeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2563eb'
  },
  retakeText: {
    color: '#93c5fd',
    fontWeight: '600'
  }
});

export default PhotoPreviewCard;
