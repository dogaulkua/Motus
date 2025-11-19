import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSessions } from '@contexts/SessionContext';
import { RootStackParamList } from '@navigation/types';
import ChatAssistant from '@components/AI/ChatAssistant';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t, i18n } = useTranslation();
  const { activeSession, sessions, startSession, loading } = useSessions();
  const [assistantVisible, setAssistantVisible] = useState(false);

  const heroCtaLabel = activeSession ? t('common.resumeCapture') : t('common.startCapture');

  const latestSession = useMemo(() => (sessions.length > 0 ? sessions[0] : undefined), [sessions]);

  const handleStart = () => {
    if (!activeSession) {
      startSession(i18n.language);
    }
    navigation.navigate('Capture');
  };

  const handleLocaleToggle = () => {
    const next = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(next);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t('common.appTitle')}</Text>
          <TouchableOpacity onPress={handleLocaleToggle}>
            <Text style={styles.localeSwitch}>
              {i18n.language === 'tr' ? t('common.secondaryLocale') : t('common.activeLocale')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{t('home.heroTitle')}</Text>
          <Text style={styles.heroSubtitle}>{t('home.heroSubtitle')}</Text>
          <TouchableOpacity style={styles.ctaButton} onPress={handleStart} disabled={loading}>
            <Text style={styles.ctaText}>{heroCtaLabel}</Text>
          </TouchableOpacity>
          <Text style={styles.dualExperience}>{t('common.dualExperience')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.tipsTitle')}</Text>
          <Text style={styles.sectionBody}>{t('home.tipsBody')}</Text>
        </View>

        {latestSession ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('common.reviewSessions')}</Text>
            <View style={styles.sessionCard}>
              <Text style={styles.sessionLabel}>{new Date(latestSession.createdAt).toLocaleString()}</Text>
              <Text style={styles.sessionDescription}>
                {latestSession.photos.length}/5 photos · {latestSession.graftEstimation ? 'AI ✓' : 'Pending AI'}
              </Text>
              <View style={styles.sessionActions}>
                <TouchableOpacity style={styles.outlineButton} onPress={() => navigation.navigate('SessionHistory')}>
                  <Text style={styles.outlineButtonText}>{t('common.reviewSessions')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.filledButton}
                  onPress={() =>
                    navigation.navigate('SessionReview', {
                      sessionId: latestSession.id
                    })
                  }
                >
                  <Text style={styles.filledButtonText}>{t('review.title')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}

        <TouchableOpacity style={styles.assistantLauncher} onPress={() => setAssistantVisible(true)}>
          <Text style={styles.assistantText}>{t('common.aiAssistant')}</Text>
          <Text style={styles.assistantBadge}>β</Text>
        </TouchableOpacity>
      </ScrollView>
      <ChatAssistant visible={assistantVisible} onClose={() => setAssistantVisible(false)} locale={i18n.language} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617'
  },
  container: {
    padding: 20,
    paddingBottom: 120,
    gap: 24
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: '#e2e8f0',
    fontSize: 20,
    fontWeight: '700'
  },
  localeSwitch: {
    color: '#93c5fd'
  },
  heroCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 12
  },
  heroTitle: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '700'
  },
  heroSubtitle: {
    color: '#cbd5f5',
    fontSize: 14
  },
  ctaButton: {
    backgroundColor: '#22c55e',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center'
  },
  ctaText: {
    color: '#052e16',
    fontWeight: '700'
  },
  dualExperience: {
    color: '#38bdf8',
    fontStyle: 'italic'
  },
  section: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 8
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700'
  },
  sectionBody: {
    color: '#cbd5f5',
    fontSize: 14
  },
  sessionCard: {
    gap: 8
  },
  sessionLabel: {
    color: '#e2e8f0',
    fontWeight: '600'
  },
  sessionDescription: {
    color: '#94a3b8'
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 10
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 10
  },
  outlineButtonText: {
    color: '#e2e8f0'
  },
  filledButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 10
  },
  filledButtonText: {
    color: '#f8fafc',
    fontWeight: '700'
  },
  assistantLauncher: {
    backgroundColor: '#172554',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  assistantText: {
    color: '#93c5fd',
    fontWeight: '600'
  },
  assistantBadge: {
    color: '#f8fafc',
    fontWeight: '700'
  }
});

export default HomeScreen;
