import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Camera, CameraType, requestCameraPermissionsAsync, getCameraPermissionsAsync } from 'expo-camera';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ANGLES } from '@constants/angles';
import { AngleConfig } from '@types';
import AngleProgress from '@components/Capture/AngleProgress';
import AngleGuideBase from '@components/AngleGuides/AngleGuideBase';
import { useOrientation } from '@hooks/useOrientation';
import { useSessions } from '@contexts/SessionContext';
// Define the RootStackParamList if the module is missing
type RootStackParamList = {
  Capture: { angleId?: string };
  // Add other screen params as needed
};

const beepUri = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

const descriptorIntervals: Record<'locked' | 'almost' | 'adjust' | 'far', number> = {
  locked: 600,
  almost: 900,
  adjust: 1400,
  far: 2100
};

const angleIdToSilhouette: Record<string, AngleConfig['silhouette']> = {
  front: 'front',
  right45: 'profile-right',
  left45: 'profile-left',
  top: 'top',
  donor: 'donor'
};

const CaptureScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Capture'>>();
  const isFocused = useIsFocused();
  const cameraRef = useRef<Camera | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const beepInterval = useRef<NodeJS.Timeout | null>(null);
  const lastVoicePrompt = useRef<number>(0);
  const toneSound = useRef<Audio.Sound | null>(null);
  const { t, i18n } = useTranslation();
  const [permission, setPermission] = useState<{ granted: boolean } | null>(null);

  useEffect(() => {
    (async () => {
      const permissionResult = await getCameraPermissionsAsync();
      setPermission({ granted: permissionResult.granted });
    })();
  }, []);

  const requestPermission = async () => {
    const permissionResult = await requestCameraPermissionsAsync();
    setPermission({ granted: permissionResult.granted });
  };
  const { activeSession, startSession, appendPhoto } = useSessions();
  const [currentIndex, setCurrentIndex] = useState(() => {
    const initialAngleId = route.params?.angleId;
    if (initialAngleId) {
      const initialIndex = ANGLES.findIndex((angle) => angle.id === initialAngleId);
      if (initialIndex >= 0) {
        return initialIndex;
      }
    }
    return 0;
  });
  const [cameraReady, setCameraReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    if (!activeSession) {
      startSession(i18n.language);
    }
  }, [activeSession, startSession, i18n.language]);

  useEffect(() => {
    const requestedAngle = route.params?.angleId;
    if (requestedAngle) {
      const nextIndex = ANGLES.findIndex((angle) => angle.id === requestedAngle);
      if (nextIndex >= 0) {
        setCurrentIndex(nextIndex);
      }
    }
  }, [route.params?.angleId]);

  useEffect(() => {
    (async () => {
      const currentPermission = permission ?? await requestPermission();
      if (!currentPermission?.granted) {
        const title = t('common.cameraPermissionTitle') as string;
        const message = t('common.cameraPermissionMessage') as string;
        Alert.alert(title, message);
      }
    })();
  }, [permission, requestPermission, t]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: beepUri }, { volume: 0.4 });
        if (mounted) {
          toneSound.current = sound;
        } else {
          await sound.unloadAsync();
        }
      } catch (error) {
        console.warn('Tone load error', error);
      }
    })();
    return () => {
      mounted = false;
      toneSound.current?.unloadAsync();
    };
  }, []);

  const currentAngle = ANGLES[currentIndex];
  const { score, descriptor, hasSensorAccess } = useOrientation(currentAngle, isFocused);

  const shouldShowCountdown = countdown !== null;

  const speak = useCallback(
    (text: string) => {
      if (!voiceEnabled) {
        return;
      }
      Speech.speak(text, { language: i18n.language });
    },
    [i18n.language, voiceEnabled]
  );

  const startBeepLoop = useCallback(
    (nextDescriptor: typeof descriptor) => {
      if (!toneSound.current) {
        return;
      }
      if (beepInterval.current) {
        clearInterval(beepInterval.current);
      }
      const interval = descriptorIntervals[nextDescriptor];
      beepInterval.current = setInterval(() => {
        toneSound.current
          ?.replayAsync()
          .catch((err: unknown) => console.warn('Beep play error', err));
      }, interval);
    },
    []
  );

  useEffect(() => {
    startBeepLoop(descriptor);
    return () => {
      if (beepInterval.current) {
        clearInterval(beepInterval.current);
      }
    };
  }, [descriptor, startBeepLoop]);

  const resetCountdown = useCallback(() => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
    setCountdown(null);
  }, []);

  const beginCountdown = useCallback(() => {
    if (isSaving || countdownInterval.current) {
      return;
    }
    setCountdown(3);
    speak(t('capture.voiceInstruction.ready'));
    countdownInterval.current = setInterval(() => {
      setCountdown((prev: number | null) => {
        if (prev && prev > 1) {
          return prev - 1;
        }
        if (prev === 1) {
          clearInterval(countdownInterval.current as NodeJS.Timeout);
          countdownInterval.current = null;
          capturePhoto();
        }
        return prev;
      });
    }, 1000);
  }, [isSaving, speak, t]);

  useEffect(() => {
    if (descriptor === 'locked') {
      beginCountdown();
    } else {
      resetCountdown();
      const now = Date.now();
      if (now - lastVoicePrompt.current > 4000 && descriptor === 'far') {
        speak(t('capture.voiceInstruction.adjust'));
        lastVoicePrompt.current = now;
      }
    }
  }, [descriptor, beginCountdown, resetCountdown, speak, t]);

  const capturePhoto = useCallback(async () => {
    if (!cameraRef.current || !currentAngle) {
      return;
    }
    setIsSaving(true);
    setCountdown(null);
    try {
      const result = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
        skipProcessing: true
      });
      if (result?.base64) {
        appendPhoto(currentAngle.id, result.base64, result.uri);
        speak(t('capture.voiceInstruction.success'));
        if (currentIndex === ANGLES.length - 1) {
          // @ts-ignore - Fix the navigation type
          navigation.navigate('SessionReview' as never, { sessionId: activeSession?.id ?? '' });
        } else {
          setCurrentIndex((prev: number) => prev + 1);
        }
      }
    } catch (error) {
      console.warn('Capture error', error);
      Alert.alert('Error', 'Unable to capture photo.');
    } finally {
      setIsSaving(false);
    }
  }, [appendPhoto, currentAngle, currentIndex, navigation, activeSession?.id, speak, t]);

  const handleManualCapture = () => {
    if (descriptor === 'locked') {
      capturePhoto();
    } else {
      speak(t('capture.voiceInstruction.adjust'));
    }
  };

  const handleNextAngle = () => {
    resetCountdown();
    if (currentIndex < ANGLES.length - 1) {
      setCurrentIndex((prev: number) => prev + 1);
    } else {
      navigation.goBack();
    }
  };

  const extraAssistText = useMemo(() => {
    if (currentAngle.id === 'top') {
      return t('capture.extraAssistTop');
    }
    if (currentAngle.id === 'donor') {
      return t('capture.extraAssistDonor');
    }
    return undefined;
  }, [currentAngle.id, t]);

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.permissionText}>{t('common.cameraPermissionMessage')}</Text>
        <TouchableOpacity style={styles.ctaButton} onPress={requestPermission}>
          <Text style={styles.ctaText}>{t('common.grant')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t(currentAngle.titleKey)}</Text>
        <AngleProgress currentAngle={currentAngle.id} />
      </View>

      <View style={styles.cameraWrapper}>
        {isFocused ? (
          <Camera
            ref={(ref) => (cameraRef.current = ref)}
            type={CameraType.front}
            style={styles.camera}
            onCameraReady={() => setCameraReady(true)}
          />
        ) : (
          <View style={styles.cameraPlaceholder}>
            <Text style={styles.scoreText}>{Math.round(score * 100)}%</Text>
          </View>
        )}
      </View>

      {!hasSensorAccess ? (
        <Text style={styles.sensorError}>{t('common.sensorPermissionMessage')}</Text>
      ) : null}

      <AngleGuideBase
        title={t(currentAngle.titleKey)}
        description={t(currentAngle.descriptionKey)}
        tip={t(currentAngle.tipKey)}
        silhouette={angleIdToSilhouette[currentAngle.id]}
        score={score}
        descriptor={descriptor}
        extraAssistText={extraAssistText}
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.secondaryButton, voiceEnabled && styles.secondaryButtonActive]}
          onPress={() => setVoiceEnabled((prev: boolean) => !prev)}
        >
          <Text style={[styles.secondaryButtonText, voiceEnabled && styles.secondaryButtonTextActive]}>
            {voiceEnabled ? '🔊' : '🔇'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={handleManualCapture} disabled={!cameraReady || isSaving}>
          {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.captureText}>{t('capture.autoCapture')}</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleNextAngle}>
          <Text style={styles.secondaryButtonText}>{t('common.nextAngle')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 16,
    gap: 12
  },
  header: {
    gap: 6
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700'
  },
  cameraWrapper: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative'
  },
  camera: {
    flex: 1,
    borderRadius: 24
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#1e293b'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlayInstruction: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },
  overlayFrame: {
    width: '70%',
    aspectRatio: 3 / 4,
    borderColor: '#38bdf8',
    borderWidth: 2,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlaySilhouette: {
    width: '80%',
    height: '80%',
    borderWidth: 2,
    borderRadius: 50,
    borderStyle: 'dashed'
  },
  countdown: {
    color: '#22c55e',
    fontSize: 64,
    fontWeight: '800',
    position: 'absolute',
    bottom: '35%'
  },
  scoreText: {
    color: '#f8fafc',
    fontSize: 32,
    fontWeight: '700',
    position: 'absolute',
    bottom: '35%'
  },
  sensorError: {
    color: '#f87171',
    textAlign: 'center'
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  captureButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center'
  },
  captureText: {
    color: '#f8fafc',
    fontWeight: '700'
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155'
  },
  secondaryButtonActive: {
    backgroundColor: '#1e293b'
  },
  secondaryButtonText: {
    color: '#94a3b8'
  },
  secondaryButtonTextActive: {
    color: '#f8fafc'
  },
  ctaButton: {
    marginTop: 16,
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16
  },
  ctaText: {
    color: '#052e16',
    fontWeight: '700'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#020617'
  },
  permissionText: {
    color: '#f8fafc',
    textAlign: 'center'
  }
});

export default CaptureScreen;
