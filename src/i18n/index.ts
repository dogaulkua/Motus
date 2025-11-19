import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        appTitle: 'Smile Hair Clinic Capture',
        startCapture: 'Start Capture',
        resumeCapture: 'Resume Capture',
        reviewSessions: 'Session History',
        activeLocale: 'Switch to Turkish',
        secondaryLocale: 'Switch to English',
        cameraPermissionTitle: 'Camera permission required',
        cameraPermissionMessage: 'We need access to your camera to guide the photos.',
        sensorPermissionMessage: 'Sensor access is required for smart guidance.',
        grant: 'Grant',
        cancel: 'Cancel',
        nextAngle: 'Next Angle',
        retake: 'Retake',
        completeSession: 'Complete Session',
        saving: 'Saving photos…',
        aiAssistant: 'AI Assistant',
        chatPlaceholder: 'Ask in Turkish or English…',
        send: 'Send',
        dualExperience: 'Equal experience for local and international patients'
      },
      home: {
        heroTitle: 'Consistent, clinician-grade hair transplant photos',
        heroSubtitle: 'Follow intelligent guidance to capture 5 precise angles anytime.',
        tipsTitle: 'Why 5 angles?',
        tipsBody: 'Consistency across time enables accurate graft estimation, donor analysis and transparent pricing.'
      },
      angles: {
        front: {
          title: 'Frontal view',
          description: 'Hold the phone parallel to the ground, align face into the frame.',
          tip: 'Keep shoulders relaxed, eyes directly at the camera.'
        },
        right45: {
          title: '45° right profile',
          description: 'Turn your chin slightly to the right until your ear aligns with the guide.',
          tip: 'Use the silhouette to match head rotation.'
        },
        left45: {
          title: '45° left profile',
          description: 'Turn your chin slightly to the left, keep the same distance.',
          tip: 'Match the contour with the overlay.'
        },
        top: {
          title: 'Vertex / Top',
          description: 'Lift the phone above your head and tilt it straight down.',
          tip: 'Use the extra mirror guide to see your crown area.'
        },
        donor: {
          title: 'Donor / Back',
          description: 'Hold the phone behind your head, keep the neck centered.',
          tip: 'Use the helper mirror or ask for assistance if possible.'
        }
      },
      capture: {
        alignPhone: 'Adjust phone angle',
        great: 'Perfect! Hold still…',
        countdown: 'Hold steady: {{seconds}}',
        autoCapture: 'Auto capture armed',
        savingPhoto: 'Processing photo…',
        voiceInstruction: {
          ready: 'Angle ready. Hold steady for auto capture.',
          success: 'Photo captured. Great job!',
          adjust: 'Adjust your phone to match the guide.'
        },
        extraAssistTop: 'Top angle helper: focus on the crown. Move slowly to find the vortex.',
        extraAssistDonor: 'Donor angle helper: align the back guide and keep shoulders level.'
      },
      review: {
        title: 'Session summary',
        subtitle: 'Photos saved locally. Share securely with your specialist anytime.',
        estimateTitle: 'AI graft estimate',
        priceBand: 'Transparent price band',
        compareTitle: 'Compare with previous photos',
        shareCta: 'Share securely'
      },
      ai: {
        typing: 'Thinking…',
        greeting: 'Merhaba! Hello! I can assist you in both Turkish and English.'
      }
    }
  },
  tr: {
    translation: {
      common: {
        appTitle: 'Smile Hair Clinic Çekim',
        startCapture: 'Çekime Başla',
        resumeCapture: 'Çekime Devam Et',
        reviewSessions: 'Geçmiş Seanslar',
        activeLocale: 'Türkçe kullan',
        secondaryLocale: 'İngilizce kullan',
        cameraPermissionTitle: 'Kamera izni gerekli',
        cameraPermissionMessage: 'Fotoğraf rehberliği için kameraya ihtiyaç var.',
        sensorPermissionMessage: 'Akıllı rehber için sensör erişimi gerekli.',
        grant: 'İzin ver',
        cancel: 'Vazgeç',
        nextAngle: 'Sonraki Açı',
        retake: 'Tekrar Çek',
        completeSession: 'Seansı Bitir',
        saving: 'Fotoğraflar kaydediliyor…',
        aiAssistant: 'Yapay Zeka Asistanı',
        chatPlaceholder: 'Türkçe veya İngilizce sor…',
        send: 'Gönder',
        dualExperience: 'Herkese eşit deneyim: yerli ve yabancı hastalar'
      },
      home: {
        heroTitle: 'Klinik seviyesinde saç ekimi fotoğrafları',
        heroSubtitle: 'Akıllı rehberi takip ederek 5 açıyı her zaman aynı şekilde yakala.',
        tipsTitle: 'Neden 5 açı?',
        tipsBody: 'Zaman içindeki tutarlılık doğru greft tahmini, donör analizi ve şeffaf fiyat için şarttır.'
      },
      angles: {
        front: {
          title: 'Ön / Frontal',
          description: 'Telefonu yere paralel tut, yüzünü tam ortaya hizala.',
          tip: 'Omuzlarını rahat bırak, kameraya düz bak.'
        },
        right45: {
          title: '%45 sağ profil',
          description: 'Çeneni hafif sağa çevir, kulak rehbere hizalansın.',
          tip: 'Baş konturunu silüetle çakıştır.'
        },
        left45: {
          title: '%45 sol profil',
          description: 'Çeneni hafif sola çevir, mesafeyi koru.',
          tip: 'Konturu üst üste getir.'
        },
        top: {
          title: 'Tepe / Vertex',
          description: 'Telefonu başının üstüne kaldır ve dik aşağı eğ.',
          tip: 'Vorteksi bulmak için ekstra aynayı kullan.'
        },
        donor: {
          title: 'Donör / Arka',
          description: 'Telefonu başının arkasına tut, boynu ortala.',
          tip: 'Yardımcı aynayı kullan veya biri destek olsun.'
        }
      },
      capture: {
        alignPhone: 'Telefon açısını ayarla',
        great: 'Harika! Kımıldama…',
        countdown: 'Sabitle: {{seconds}}',
        autoCapture: 'Otomatik çekim hazır',
        savingPhoto: 'Fotoğraf işleniyor…',
        voiceInstruction: {
          ready: 'Açı hazır. Otomatik çekim için sabit kal.',
          success: 'Fotoğraf çekildi. Harika!',
          adjust: 'Rehbere uymak için telefonu ayarla.'
        },
        extraAssistTop: 'Tepe yardımcı: tepe noktasına odaklan. Yavaşça hareket et.',
        extraAssistDonor: 'Donör yardımcı: arka rehberi hizala ve omuzları düz tut.'
      },
      review: {
        title: 'Seans özeti',
        subtitle: 'Fotoğraflar yerelde saklandı. Uzmanla dilediğin zaman paylaş.',
        estimateTitle: 'Yapay zeka greft tahmini',
        priceBand: 'Şeffaf fiyat aralığı',
        compareTitle: 'Önceki fotoğraflarla karşılaştır',
        shareCta: 'Güvenle paylaş'
      },
      ai: {
        typing: 'Düşünüyor…',
        greeting: 'Merhaba! Hello! Sana Türkçe veya İngilizce yardımcı olabilirim.'
      }
    }
  }
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: 'tr',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });
}

export default i18n;
