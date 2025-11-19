import React from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSessions } from '@contexts/SessionContext';
import { RootStackParamList } from '@navigation/types';

const SessionHistoryScreen: React.FC = () => {
  const { sessions, setActiveSession } = useSessions();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{t('review.subtitle')}</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('SessionReview', { sessionId: item.id })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{new Date(item.createdAt).toLocaleString()}</Text>
                <Text style={styles.cardSub}>{item.locale.toUpperCase()}</Text>
              </View>
              <Text style={styles.cardBody}>{item.photos.length}/5 photos</Text>
              <View style={styles.cardFooter}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    setActiveSession(item.id);
                    navigation.navigate('Capture');
                  }}
                >
                  <Text style={styles.secondaryText}>{t('common.resumeCapture')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => navigation.navigate('SessionReview', { sessionId: item.id })}
                >
                  <Text style={styles.primaryText}>{t('review.title')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617'
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center'
  },
  listContent: {
    padding: 16,
    gap: 16
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 12
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    color: '#f8fafc',
    fontWeight: '700'
  },
  cardSub: {
    color: '#38bdf8'
  },
  cardBody: {
    color: '#cbd5f5'
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 12
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center'
  },
  secondaryText: {
    color: '#e2e8f0'
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center'
  },
  primaryText: {
    color: '#f8fafc',
    fontWeight: '700'
  }
});

export default SessionHistoryScreen;
