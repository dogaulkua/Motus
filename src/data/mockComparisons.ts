import { AngleId, CapturedPhoto } from '@types';

interface ComparisonSet {
  angleId: AngleId;
  label: string;
  photos: CapturedPhoto[];
}

const base64Placeholder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lvVsXwAAAABJRU5ErkJggg==';

export const mockComparisons: ComparisonSet[] = [
  {
    angleId: 'front',
    label: 'Front Progress',
    photos: [
      { angleId: 'front', base64: base64Placeholder, timestamp: Date.now() - 86400000 * 30 },
      { angleId: 'front', base64: base64Placeholder, timestamp: Date.now() - 86400000 * 60 }
    ]
  },
  {
    angleId: 'donor',
    label: 'Donor Area',
    photos: [
      { angleId: 'donor', base64: base64Placeholder, timestamp: Date.now() - 86400000 * 30 },
      { angleId: 'donor', base64: base64Placeholder, timestamp: Date.now() - 86400000 * 90 }
    ]
  }
];
