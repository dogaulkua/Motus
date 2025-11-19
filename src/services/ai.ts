import { CaptureSession, GraftEstimationResult } from '@types';

const pricePerGraft = 12.5; // TL baseline

export const mockEstimateGrafts = async (session: CaptureSession): Promise<GraftEstimationResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const intensity = session.photos.length === 5 ? 1 : session.photos.length / 5;
  const base = 1800 + Math.floor(Math.random() * 600 * intensity);
  const min = base;
  const max = base + 400;
  return {
    min,
    max,
    minPrice: Math.round(min * pricePerGraft),
    maxPrice: Math.round(max * pricePerGraft)
  };
};

export const mockChatReply = async (message: string, locale: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (locale === 'tr') {
    return `Yapay zeka yanıtı: ${message} sorunu için hem Türkçe hem İngilizce bilgi sağlayabilirim. Fotoğrafları tamamladıktan sonra uzman ekibimiz seni arayacak.`;
  }
  return `AI reply: I can support both local and international patients. Regarding "${message}", expect a specialist follow-up soon.`;
};
