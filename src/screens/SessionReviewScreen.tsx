import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  ImageBackground
} from 'react-native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ANGLES } from '@constants/angles';
import { useSessions } from '@contexts/SessionContext';
import PhotoPreviewCard from '@components/Review/PhotoPreviewCard';
import { mockEstimateGrafts } from '@services/ai';
import { mockComparisons } from '@data/mockComparisons';
import { ANGLE_PLACEHOLDERS } from '@constants/placeholders';
import { AngleId, CapturedPhoto } from '@types';
import { RootStackParamList } from '@navigation/types';

const SessionReviewScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'SessionReview'>>();
  const { sessions, updateSessionEstimate, setActiveSession } = useSessions();
  const session = sessions.find((item) => item.id === route.params.sessionId);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      Alert.alert('Not found', 'Session missing', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    }
  }, [session, navigation]);

  const latestEstimate = session?.graftEstimation;

  const handleEstimate = async () => {
    if (!session) {
      return;
    }
    try {
      setError(null);
      setLoadingEstimate(true);
      const result = await mockEstimateGrafts(session);
      updateSessionEstimate(session.id, result);
    } catch (err) {
      console.warn('estimate error', err);
      setError('Unable to reach AI service.');
    } finally {
      setLoadingEstimate(false);
    }
  };

  const photoMap = useMemo<Record<AngleId, string | undefined>>(() => {
    const map: Record<AngleId, string | undefined> = {
      front: undefined,
      right45: undefined,
      left45: undefined,
      top: undefined,
      donor: undefined
    };
    session?.photos.forEach((photo) => {
      map[photo.angleId] = photo.base64;
    });
    return map;
  }, [session]);

  const comparisonSets = useMemo(() => mockComparisons, []);

  const handleShare = async () => {
    if (!session) {
      return;
    }
    const estimateText = latestEstimate
      ? `${latestEstimate.min}-${latestEstimate.max} graft (${latestEstimate.minPrice}-${latestEstimate.maxPrice} TL)`
      : t('review.subtitle');
    const message = `Smile Hair Clinic • ${new Date(session.createdAt).toLocaleString()}\n${estimateText}\nPhotos captured: ${session.photos.length}/5`;
    try {
      await Share.share({ message });
    } catch (shareError) {
      console.warn('share error', shareError);
      Alert.alert('Share failed', 'Unable to open native share sheet.');
    }
  };

  if (!session) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{t('review.title')}</Text>
            <Text style={styles.subtitle}>{t('review.subtitle')}</Text>
          </View>
          <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('SessionHistory')}>
            <Text style={styles.historyText}>{t('common.reviewSessions')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Angles</Text>
          <View style={styles.grid}>
            {ANGLES.map((angle) => (
              <PhotoPreviewCard
                key={angle.id}
                angleId={angle.id}
                base64={photoMap[angle.id]}
                onRetake={() => {
                  setActiveSession(session.id);
                  navigation.navigate('Capture', { angleId: angle.id });
                }}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>{t('review.estimateTitle')}</Text>
              {latestEstimate ? (
                <Text style={styles.sectionBody}>
                  {latestEstimate.min}-{latestEstimate.max} graft · {latestEstimate.minPrice}-{latestEstimate.maxPrice} TL
                </Text>
              ) : (
                <Text style={styles.sectionBody}>{t('review.subtitle')}</Text>
              )}
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={handleEstimate} disabled={loadingEstimate}>
              {loadingEstimate ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>AI</Text>}
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('review.compareTitle')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.comparisonScroll}>
            {comparisonSets.map((set) => (
              <View key={set.label} style={styles.comparisonCard}>
                <Text style={styles.comparisonLabel}>{set.label}</Text>
                <View style={styles.comparisonRow}>
                  {set.photos.map((photo, idx) => (
                    <View key={photo.timestamp} style={styles.comparisonThumb}>
                      <Text style={styles.comparisonCaption}>T-{(idx + 1) * 30}d</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareText}>{t('review.shareCta')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617'
  },
  content: {
    padding: 16,
    gap: 20,
    paddingBottom: 120
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '700'
  },
  subtitle: {
    color: '#94a3b8'
  },
  historyButton: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  historyText: {
    color: '#e2e8f0'
  },
  section: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 12
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700'
  },
  sectionBody: {
    color: '#94a3b8'
  },
  grid: {
    gap: 12
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14
  },
  primaryText: {
    color: '#f8fafc',
    fontWeight: '700'
  },
  errorText: {
    color: '#f87171'
  },
  comparisonScroll: {
    flexDirection: 'row'
  },
  comparisonCard: {
    backgroundColor: '#172554',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    width: 200,
    gap: 8
  },
  comparisonLabel: {
    color: '#f8fafc',
    fontWeight: '600'
  },
  comparisonRow: {
    flexDirection: 'row',
    gap: 8
  },
  comparisonThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden'
  },
  comparisonCaption: {
    position: 'absolute',
    bottom: 4,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(2,6,23,0.7)',
    color: '#f8fafc',
    fontSize: 11
  },
  shareButton: {
    backgroundColor: '#22c55e',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center'
  },
  shareText: {
    color: '#052e16',
    fontWeight: '700'
  }
});

export default SessionReviewScreen;
